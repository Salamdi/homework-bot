# Home work bot
Add this bot to your group. Give admin privileges so he is able to pin messages. Send him a private message. He will take that message and append it to the end of previously pinned message while removing the first one. Then he will send the result to the group and pin it. Home works in pinned message should be separated by two new line characters (`\n\n`).

## Usage

Clone or download the repository
-
```sh
git clone https://github.com/Salamdi/homework-bot.git
```
Cd into the directory
-
```sh
cd homework-bot
```
Set required environment variables.
-
Create new `.env` file. Copy `.env.dist` contents into it.
If you are on linux you can achieve this via:
```sh
cp .env.dist .env
```
Edit it accordingly.

Install dependencies and run.
-
```sh
npm install
npm run dev
```
