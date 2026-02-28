// サーバーのURL（だいきのサーバーに直結！）
const API_URL = "https://reversi-server.vercel.app/api";

let board = Array(8).fill().map(() => Array(8).fill(0));
let curColor = 1; // 1: 黒, 2: 白

// 初期化：真ん中の4つの石
function resetLocalBoard() {
    board = Array(8).fill().map(() => Array(8).fill(0));
    board[3][3] = 2; board[3][4] = 1;
    board[4][3] = 1; board[4][4] = 2;
    curColor = 1;
    renderBoard();
}

// サーバーの生存確認
async function checkServer() {
    try {
        const res = await fetch(API_URL);
        const data = await res.json();
        document.getElementById('db-status').innerText = data.database === "Connected" ? "オンライン" : "DBエラー";
    } catch (e) {
        document.getElementById('db-status').innerText = "オフライン";
    }
}

// 盤面を描画
function renderBoard() {
    const boardEl = document.getElementById('board');
    boardEl.innerHTML = '';

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.onclick = () => handleCellClick(r, c);

            if (board[r][c] !== 0) {
                const stone = document.createElement('div');
                stone.className = `stone ${board[r][c] === 1 ? 'black' : 'white'}`;
                cell.appendChild(stone);
            }
            boardEl.appendChild(cell);
        }
    }
    const turnEl = document.getElementById('current-turn');
    turnEl.innerText = curColor === 1 ? "黒 (1)" : "白 (2)";
    turnEl.className = curColor === 1 ? "turn-black" : "turn-white";
}

// 石を置く（サーバーに判定をお願いする）
async function handleCellClick(r, c) {
    try {
        const response = await fetch(`${API_URL}/move`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ board, r, c, color: curColor })
        });

        const data = await response.json();

        if (response.ok) {
            board = data.board;
            curColor = 3 - curColor; // ターン交代
            renderBoard();
        } else {
            alert(data.error || "そこには置けません");
        }
    } catch (e) {
        alert("サーバー通信エラーが発生しました");
    }
}

// ユーザー登録・ログイン
async function auth(type) {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!username || !password) return alert("入力してくれ！");

    try {
        const response = await fetch(`${API_URL}/${type}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (response.ok) {
            alert("成功！");
            document.getElementById('player-name').innerText = username;
        } else {
            alert("失敗: " + data.error);
        }
    } catch (e) {
        alert("サーバーに接続できません");
    }
}

// 起動
checkServer();
resetLocalBoard();
