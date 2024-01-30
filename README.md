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

## Snowflakes
The `CordXSnowflake` class is our solution for generating unique, time-ordered identifiers, 
known as Snowflakes. This approach provides several benefits:

1. **Uniqueness Across Systems**: Each Snowflake is unique across multiple workers and datacenters, thanks to a worker ID, a datacenter ID, and a sequence number.

2. **Time-Ordered**: Snowflakes are generated in a way that they are ordered based on the time of creation. This is useful in scenarios where the order of creation matters.

3. **Efficient Generation**: The `generate()` method creates a Snowflake efficiently, even if it's called multiple times in the same millisecond. It does this by incrementing a sequence number to ensure uniqueness.

4. **Decomposable**: The `decompose(id)` method allows you to break down a Snowflake into its constituent parts: timestamp, worker ID, datacenter ID, and sequence number. This can be useful for debugging or understanding more about where and when the Snowflake was generated.

5. **Flexible Creation**: When creating a new `CordXSnowflake`, you can optionally provide a worker ID, a datacenter ID, and an epoch. If not provided, the class will generate the worker and datacenter IDs for you, and set the epoch to `1288834974657n`.

Behind the scenes, `CordXSnowflake` also uses a couple of private methods to do its job:

- `timeGen()`: This method gets the current time in milliseconds.
- `tilNextMillis(lastTimestamp)`: This method waits until the next millisecond, then gets the current time in milliseconds.

---

## Keys

The `Keys` class is our solution for managing API keys. This approach provides several benefits:

1. **Centralized Control**: All keys are managed from a single point, making it easier to control and monitor their states.

2. **Resource Efficiency**: Keys are created on-demand and stored for future use. This means that we only create a key when it's needed, which can save resources.

3. **Consistency**: Since there's only one instance of each key at any given time, we can ensure that all parts of our application are working with the same data, which helps maintain consistency.

4. **Easy Debugging**: With a single point of control, it's easier to track down and fix issues. We also log messages when keys are created or retrieved, which can help with debugging.

5. **Monitoring**: The `health()` method allows us to keep track of the state of the `Keys` class. It checks the health of the `InstanceClient` and returns a string indicating the health status.

The `Keys` class is responsible for managing keys in our application. It provides methods to initialize the keys client, validate the environment file, and check for the existence of base and admin level API keys. Keys are stored in a Mongoose model, allowing for efficient retrieval and management.

---

## DNSClient

The `DNSClient` class in the CordX library is our solution for managing DNS related operations. This approach provides several benefits:

1. **Centralized Control**: All DNS operations are managed from a single point, making it easier to control and monitor their states.

2. **Resource Efficiency**: DNS checks are performed on-demand and results can be cached for future use. This means that we only perform a DNS check when it's needed, which can save resources.

3. **Consistency**: Since there's only one instance of the DNSClient at any given time, we can ensure that all parts of our application are working with the same data, which helps maintain consistency.

4. **Easy Debugging**: With a single point of control, it's easier to track down and fix issues. We also log messages when DNS checks are performed, which can help with debugging.

5. **Blacklist**: The `blacklisted(domain: string)` method allows us to keep track of the state of a domain. It checks if a domain contains any blacklisted keywords and returns a boolean.

The `DNSClient` class is responsible for managing DNS operations in our application. It provides methods to check if a domain is blacklisted, filter a subdomain to get its main domain, and check if a domain has a specific TXT record. DNS operations are performed using the `dns` module, allowing for efficient and reliable DNS checks.

