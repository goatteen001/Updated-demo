import os

def main() -> None:
    try:
        # Importing loads env vars and Supabase client, but does not make network calls.
        from main import app  # noqa: F401
    except Exception as e:
        print("[Smoke] Failed to import ai-service app:", e)
        raise

    routes = [(r.path, sorted(list(getattr(r, "methods", []) or []))) for r in app.routes]
    print("[Smoke] AI service routes:")
    for path, methods in routes:
        if methods:
            print(f"  {path} -> {methods}")


if __name__ == "__main__":
    main()

