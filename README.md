# CordX DNS
CordX DNS is a comprehensive RESTful API for managing our Domain Name System and its associated classes, events, and more.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
  - [Instance Management](#instance-management)
  - [Snowflakes](#snowflakes)
  - [API Key Management](#api-key-management)
  - [DNS Operations](#dns-operations)
- [To-Do](#to-do)

---

## Overview
Our system is designed with a focus on centralized control, resource efficiency, consistency, easy debugging, and monitoring. We use a singleton instance solution to manage and control the instances of our application, providing several benefits.

---

## Features

### Instance Management
The `InstanceClient` class manages instances in our application. It provides `create`, `get`, and `monitor` methods to create new instances, retrieve existing ones, or monitor the state of instances, respectively. Instances are stored in a `Map` with their names as keys, allowing for efficient retrieval.

### Snowflakes
The `CordXSnowflake` class generates unique, time-ordered identifiers, known as Snowflakes. It ensures uniqueness across multiple workers and datacenters, time-ordered generation, efficient generation, decomposability, and flexible creation.

### API Key Management
The `Keys` class manages API keys. It provides methods to initialize the keys client, validate the environment file, and check for the existence of base and admin level API keys. Keys are stored in a Mongoose model, allowing for efficient retrieval and management.

### DNS Operations
The `DNSClient` class manages DNS related operations. It provides methods to check if a domain is blacklisted, filter a subdomain to get its main domain, and check if a domain has a specific TXT record. DNS operations are performed using the `dns` module, allowing for efficient and reliable DNS checks.

---

## To-Do
- Improve the approach to executing instance operations.
- Implement the execution method across all created instances.
- Cleanup the main server client/file where necessary.
- Consider adding Redis for managing instances and their state.
- Improve the "DNS" client.