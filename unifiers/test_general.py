import debugpy
debugpy.listen(5698)
print("🚦 Waiting for debugger to attach on port 5698...")
debugpy.wait_for_client()
debugpy.breakpoint()