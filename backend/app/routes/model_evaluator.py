from fastapi import APIRouter, Depends, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
import pandas as pd
import numpy as np
import onnxruntime as ort
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
import tempfile
import os

router = APIRouter()

TEST_DATA_PATH = r"D:\Projects\Hacklens\backend\app\routes\test.csv"

@router.post("/evaluate-model")
async def evaluate_model(file: UploadFile = File(...)):
    if not file.filename.endswith(".onnx"):
        raise HTTPException(status_code=400, detail="Only .onnx model files are allowed")

    try:
        # Save uploaded model temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".onnx") as tmp:
            contents = await file.read()
            tmp.write(contents)
            tmp_path = tmp.name

        # Load test data
        df = pd.read_csv(TEST_DATA_PATH)
        X_test = df.drop(columns=["target"])
        y_test = df["target"].values

        # Prepare ONNX runtime session
        sess = ort.InferenceSession(tmp_path, providers=["CPUExecutionProvider"])
        input_name = sess.get_inputs()[0].name
        output_name = sess.get_outputs()[0].name

        # Ensure correct dtype
        X_input = X_test.astype(np.float32)

        # Run inference
        y_pred = sess.run([output_name], {input_name: X_input.values})[0]
        y_pred = np.argmax(y_pred, axis=1) if y_pred.ndim > 1 else y_pred

        # Compute metrics
        accuracy = accuracy_score(y_test, y_pred)
        precision = precision_score(y_test, y_pred, average='weighted', zero_division=0)
        recall = recall_score(y_test, y_pred, average='weighted', zero_division=0)
        f1 = f1_score(y_test, y_pred, average='weighted', zero_division=0)

        # Combine into one score
        final_score = (0.4 * accuracy + 0.2 * precision + 0.2 * recall + 0.2 * f1)

        # Clean up temp file
        os.remove(tmp_path)

        result = {
            "accuracy": accuracy,
            "precision": precision,
            "recall": recall,
            "f1_score": f1, 
            "final_combined_score": final_score
        }

        return JSONResponse(content=result)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
