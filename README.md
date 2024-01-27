# CordX DNS
This is a simple yet more in depth then it needs to be Restful API
for our Domain Name System and all of its classes, events etc.

---

## To-Do
- Add a better approach to executing instance operations.
- Implement the execution method across all created instances.
- Cleanup the main server client/file (at least where necessary).
- Look into adding redis for help with managing instances and their state.
- Implement a better approach to the "DNS" client, it works but needs help.

---

## Instances
We use a singleton instance solution to manage and control the instances of our application. This approach provides several benefits:

1. **Centralized Control**: All instances are managed from a single point, making it easier to control and monitor their states.

2. **Resource Efficiency**: Instances are created on-demand and stored for future use. This means that we only create an instance when it's needed, which can save resources.

3. **Consistency**: Since there's only one instance of each component at any given time, we can ensure that all parts of our application are working with the same data, which helps maintain consistency.

4. **Easy Debugging**: With a single point of control, it's easier to track down and fix issues. We also log messages when instances are created or retrieved, which can help with debugging.

5. **Monitoring**: The `monitor` method allows us to keep track of the state of each instance. It checks the health of each instance and can trigger actions based on their state, such as restarting unhealthy instances or scaling up when necessary.

The `InstanceClient` class is responsible for managing instances in our application. It provides `create`, `get`, and `monitor` methods to create new instances, retrieve existing ones, or monitor the state of instances, respectively. Instances are stored in a `Map` with their names as keys, allowing for efficient retrieval.

---


