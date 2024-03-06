<img src="SIQ.png" alt="SIQ" width="200"/>

# storeIQ
Introducing a user-friendly JavaScript library designed for effortless data storage. This library simplifies the process by analyzing the data and determining the most efficient storage location. Moreover, it enhances performance by caching data in memory for quicker access during repeated use. With this tool, managing data becomes both straightforward and efficient.
## Installation
To install storeIQ, their are several options available. You can either use npm. (Currently not available)
```bash
npm install store-iq
```
Or you can clone the repository and use the source code directly.
```bash
git clone
# And then you should build the source code again
npm run build
```
Or download the releases package and use it directly in your project.
* [Latest Release](https://github.com/TLTimeplex/storeIQ/releases/latest)
## Usage
```ts
import storeIQ from './PATH/TO/STOREIQ/dist/index.mjs';

// Create a new storeIQ instance
const store = new storeIQ(/** settings overwrite */);

// Start and Initialize the storeIQ instance
await store.start();
```
### If you are not using React or something similar you need to change your `HTML`
```html
<script src="Your_Script.js"></script>
```
to
```html
<script type="module" src="Your_Script.js"></script>
```
## Interface
This is subject to change, but here is the currently planned interface of the library.
- **Modifying**
  - `async setItem(key: string, value: any, options?: EntryOptions): void`  
    Stores a value under the specified key
  - `async getItem(key: string): any`  
    Retrieves the value of the specified key
  - `async removeItem(key: string): void`  
    Deletes the value of the specified key
  - `async delete(): void`  
    Deletes all data stored with the library

- **Internal**
  - `async clear(): void`  
    Clears all temporary data
  - `async getMeta(key: string): EntryMeta`  
    Retrieves the metadata of the specified key
  - `async getLength(): number`  
    Retrieves the number of stored items
  - `async keys(): string[]`  
    Retrieves all stored keys
  - `async has(key: string): boolean`  
    Returns whether a value is stored under the specified key
  - `async setOptions(options: EntryOptions): void`  
    Sets the configuration options
  - `async flush(): void`  
    Performs any remaining storage operations

- **Events**
  - `on(key: string, callback: (oldValue: any, newValue: any) => boolean): void`  
    Executes the callback function when the value of the specified key changes
  - `off(key: string, callback: (oldValue: any, newValue: any) => boolean): void`
  - `offAll(key: string): void`  
    Removes the callback function
  - `onError(callback: (error: Error) => void): void`  
    Executes the callback function when an error occurs
  - `offError(callback: (error: Error) => void): void`
  - `offAllErrors(): void`  
    Removes all error callback functions

- **Objects**
  - `EntryOptions`  
    Configuration options for storing a value, such as lifespan
  - `EntryMeta`  
    Metadata of a value, such as lifespan, storage location, and size

## Demo
To try out the demo perform the following steps:
1. Clone the repository
2. Run the following commands
```bash
cd ./demo/
npm install
npm run start
```
3. Open your browser and navigate to `http://localhost:3000/`

This Tests will show you the basic abilities of the library and a basic example of how to use it.

### Analyzing the demo
If you would like to follow the code with the stepper to understand how the library works, you can do so by following the steps below:
1. In the source folder, perform the following command. This will build the project with the source maps.
```bash
npm run dev-build
```
2. Change the `index.html` file in the `demo` folder to include the source script and not the minified version.
```html
<script type="module" src="<script>.min.js"></script>
<!-- TO -->
<script type="module" src="<script>.js"></script>
```