import docker
import io
import tarfile
import uuid

client = docker.from_env()

LANGS = {
    "python": {
        "image": "python:3.10-slim",
        "ext": ".py",
        "filename": None,  # auto-generated
        "classname": None,
        "cmd": lambda name: f"python3 /code/{name}.py"
    },
    "ml_python": {
        "image": "hacklens-ml-env:latest", # Reference the image name from docker-compose
        "ext": ".py",
        "filename": None,
        "classname": None,
        "cmd": lambda name: f"python3 /code/{name}.py"
    },
    "cpp": {
        "image": "gcc:latest",
        "ext": ".cpp",
        "filename": None,
        "classname": None,
        "cmd": lambda name: f"bash -c 'g++ /code/{name}.cpp -o /code/{name} && /code/{name}'"
    },
    "java": {
        "image": "eclipse-temurin:17-jdk",
        "ext": ".java",
        "filename": "Main.java",       # Fixed for Java
        "classname": "Main",
        "cmd": lambda _: "bash -c 'javac /code/Main.java && java -cp /code Main'"
    }
}


def _make_tar_bytes(filename: str, content: str) -> bytes:
    """Creates an in-memory tar archive containing a single file (for Docker put_archive)."""
    file_data = content.encode("utf-8")
    tar_stream = io.BytesIO()

    with tarfile.open(fileobj=tar_stream, mode="w") as tar:
        info = tarfile.TarInfo(filename)
        info.size = len(file_data)
        tar.addfile(info, io.BytesIO(file_data))

    tar_stream.seek(0)
    return tar_stream.read()


def execute_code(language: str, code: str):
    language = language.lower()

    if language not in LANGS:
        return {"status": "error", "output": f"Unsupported language: {language}"}

    cfg = LANGS[language]
    container = None

    # Generate filename
    if cfg["filename"]:
        # Java case → always Main.java
        filename = cfg["filename"]
        name_without_ext = cfg["classname"]
    else:
        # Python / C++ → unique filename
        base = str(uuid.uuid4()).replace("-", "")
        filename = f"{base}{cfg['ext']}"
        name_without_ext = base

    try:
        # Ensure the image is available locally; try to pull if missing
        try:
            client.images.pull(cfg["image"])
        except Exception:
            # If pull fails, continue and let container.create raise a descriptive error
            pass

        # 1️⃣ Create container
        container = client.containers.create(
            image=cfg["image"],
            command=cfg["cmd"](name_without_ext),
            working_dir="/code",
            network_disabled=True,      # safe environment
            mem_limit="256m",
            detach=True
        )

        # 2️⃣ Upload code into container
        tar_bytes = _make_tar_bytes(filename, code)
        container.put_archive("/code", tar_bytes)

        # 3️⃣ Run container
        container.start()

        # 4️⃣ Wait for execution
        result = container.wait(timeout=20)
        exit_code = result.get("StatusCode", 1)

        # 5️⃣ Read logs
        logs = container.logs().decode("utf-8")

        if exit_code == 0:
            return {"status": "success", "output": logs}
        else:
            return {"status": "error", "output": logs}

    except Exception as e:
        return {"status": "error", "output": str(e)}

    finally:
        if container:
            try:
                container.remove(force=True)
            except:
                pass
