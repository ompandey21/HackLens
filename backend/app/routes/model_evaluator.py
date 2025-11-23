from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
import pandas as pd
import numpy as np
import onnxruntime as ort
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
import tempfile, os

router = APIRouter()

TEST_DATA_PATH = r"D:\Projects\Hacklens\backend\app\routes\test.csv"


@router.post("/evaluate-model")
async def evaluate_model(file: UploadFile = File(...)):
    """External route version (API endpoint)."""
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".onnx") as tmp:
            contents = await file.read()
            tmp.write(contents)
            tmp_path = tmp.name

        result = await run_model_evaluation(tmp_path)
        os.remove(tmp_path)
        return JSONResponse(content=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ✅ ADD THIS BELOW
async def run_model_evaluation(file_path: str) -> dict:
    """Reusable internal function to evaluate ONNX models from file path."""
    if not os.path.exists(TEST_DATA_PATH):
        raise FileNotFoundError("Missing test data CSV at TEST_DATA_PATH.")

    df = pd.read_csv(TEST_DATA_PATH)
    X_test = df.drop(columns=["target"])
    y_test = df["target"].values

    sess = ort.InferenceSession(file_path, providers=["CPUExecutionProvider"])
    input_name = sess.get_inputs()[0].name
    output_name = sess.get_outputs()[0].name

    X_input = X_test.astype(np.float32)
    y_pred = sess.run([output_name], {input_name: X_input.values})[0]
    y_pred = np.argmax(y_pred, axis=1) if y_pred.ndim > 1 else y_pred

    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred, average='weighted', zero_division=0)
    recall = recall_score(y_test, y_pred, average='weighted', zero_division=0)
    f1 = f1_score(y_test, y_pred, average='weighted', zero_division=0)

    return {
        "accuracy": accuracy,
        "precision": precision,
        "recall": recall,
        "f1_score": f1,
        "final_combined_score": (
            0.4 * accuracy + 0.2 * precision + 0.2 * recall + 0.2 * f1
        ),
    }
