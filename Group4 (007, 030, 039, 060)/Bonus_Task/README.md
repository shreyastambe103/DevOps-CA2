# GitHub Follower Tracker

The **GitHub Follower Tracker** is a web application designed to efficiently retrieve and display follower and following data for GitHub users. It leverages the GitHub API to provide insights into user relationships on the platform.


## 👨‍💻 Authors

- **Abhishek Rajput - 22070122007**
- **Arnav Jain - 22070122030**
- **Atul Goyal - 22070122039**
- **Esha Sangra- 22070122060**


## Problem URL: 
```
https://stackoverflow.com/questions/59794889/how-to-get-count-of-followers-through-github-api
```
## Solution URL:
```
https://git-followers-tracker.vercel.app/
```

## Table of Contents

- [Getting Started](#getting-started)
- [Features](#features)
- [Technical Stack](#technical-stack)
- [Images](#images)
- [Usage](#usage)
- [License](#license)


## Getting Started

### Prerequisites

- **Python 3.x**
- **Flask** for the web framework
- **Requests** library for HTTP requests

Install the required libraries:

```bash
pip install flask requests
```

### Project Setup

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/Abhishek-2502/Git_Followers_Tracker
    ```

2. **Navigate to the Project Directory**:
    ```bash
    cd github-follower-tracker-website
    ```

3. **Run the Application**:
    ```bash
    python app.py
    ```

4. **Access the Web App**:
    Open your browser and go to `http://127.0.0.1:5000`.

## Features

- **Fetch Followers and Following**: Retrieve and display lists of a user's followers and the users they follow.
- **Identify Non-Followers**: List users who you followed but they do not follow back.
- **Mutual Followers**: Show users who mutually follow the specified account.
- **Not Following Back**: List users who followed you but you do not follow back.
- **Responsive UI**: Designed for optimal performance on both desktop and mobile devices.

## Technical Stack

- **Backend**: Python, Flask
- **HTTP Requests**: Requests library for API interactions
- **Frontend**: HTML, Bootstrap for styling

## Images

![Main](ss/Main.png)
![List](ss/List.png)

## Usage

1. **Input GitHub Username**: Enter a GitHub username on the homepage.
2. **View Results**: Results will display follower and following lists, mutual followers, and non-followers.
3. **Analyze Relationships**: Utilize the organized data for insights into user connections.

## License
This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

Contributions, feedback, and issue reports are welcome.
