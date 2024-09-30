# ISA Lab 3 - File Operations Using Vercel and Node.js

## Project Overview
This project demonstrates basic file operations such as writing to and reading from a text file in the `/tmp` directory on Vercel. The server is built using Node.js and provides two main endpoints to write and read data.

## Features
1. **Write File**: Appends text to a file named `file.txt` in the `/tmp` directory.
2. **Read File**: Reads the contents of the `file.txt` and displays it in the browser.

## Endpoints

### 1. Write File
- **URL**: `/writeFile?text=YourTextHere`
- **Description**: Appends the specified text to the `file.txt` in the `/tmp` directory. Creates the file if it does not exist.
- **Example**:
https://lab3-get-date.vercel.app/?text=HelloWorld

This will append the text `HelloWorld` to the file `file.txt`.

### 2. Read File
- **URL**: `/read`
- **Description**: Reads the contents of `file.txt` in the `/tmp` directory and displays it in the browser. If the file does not exist, it returns a `404` error.
- **Example**:
https://lab3-read-write.vercel.app/read/file.txt
This will display the contents stored in `file.txt`.

## Project Setup

1. **Clone the Repository**:
 ```bash
 git clone https://github.com/mika-em/ISA_Lab3.git
 cd ISA_Lab3
 npm install
 cd getDate
 node server.js
 cd readWriteFile
 node app.js