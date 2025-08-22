import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(
    title="Template Project REACT + Fastapi",
    description="Template Project REACT + Fastapi",
    version="1.0.0",
)

# Add CORS middleware before defining routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/v1/hello")
def read_root():
    return {"message": "This comes from the backend"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8008, reload=True)
