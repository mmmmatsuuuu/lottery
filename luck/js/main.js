// tailwind設定
tailwind.config = {
  theme: {
    extend: {
      colors: {
        back: "#FAF3E0",
        "button-back": "#00897B",
        "button-text": "#FFFFFF",
        "card-back": "#FFFAFA",
        "card-text": "#424242",
        "input-back": "#E0F2F1",
        "input-text": "#00695C",
      },
      keyframes: {
        customBounce: {
          "0%, 100%": { transform: "translateY(-10%)" },
          "50%": { transform: "translateY(0)" },
        },
      },
      animation: {
        customBounce: "customBounce 1s infinite",
      },
    },
  },
};

/**
 * id : 識別番号
 * value : 表示する値
 * isOpen: カードの値が表示されている状態かどうか
 */
const values = [
  { id: 1, value: "〇", isOpen: false },
  { id: 2, value: "×", isOpen: false },
  { id: 3, value: "×", isOpen: false },
  { id: 4, value: "×", isOpen: false },
  { id: 5, value: "×", isOpen: false },
];

/**
 * card-num, win-num, win-mark, lose-markに入力された値から配列valuesを初期化
 * valuesの要素をランダムに並べ替える
 * card-containerにvaluesの値が入ったカードを表示する。
 */
async function handOutCard() {
  // card-num, win-num, win-mark, lose-markに入力された値を取得
  let cardNum = Number(document.getElementById("card-num").value);
  let winNum = Number(document.getElementById("win-num").value);
  let winMark = document.getElementById("win-mark").value;
  let loseMark = document.getElementById("lose-mark").value;

  // 配列の初期化
  values.length = 0;
  var j = 0;
  for (let i = 1; i <= cardNum; i++) {
    if (j < winNum) {
      values.push({ id: i, value: winMark, isOpen: false });
    } else {
      values.push({ id: i, value: loseMark, isOpen: false });
    }
    j++;
  }

  // 配列の要素をランダムに並び替え、カードを表示する。
  await shuffle();
}

/**
 * valuesの要素をランダムに並べ替える
 * card-containerにvaluesの値が入ったカードを表示する。
 */
async function shuffle() {
  // 配列の要素をランダムに並び替える
  shuffleArray(values, 100);

  // カードを表示する
  const container = document.getElementById("card-conteiner");
  container.innerHTML = "";
  for (let i = 0; i < values.length; i++) {
    var cardElement = createCard(
      values[i].id,
      values[i].value,
      values[i].isOpen,
    );
    container.appendChild(cardElement);
    await sleep(2000 / values.length);
  }
  console.log(values);
}

/**
 * クリックのたびにカードの表示状態を変更する
 * 表示 <-> 非表示
 */
function toggleCard(element) {
  let value = Number(element.getAttribute("card-num"));

  // 状態取得
  let cardNum;
  for (let i = 0; i < values.length; i++) {
    if (values[i].id == value) {
      cardNum = i;
    }
  }

  if (values[cardNum].isOpen) {
    // 配列のisOpenをfalseに更新
    values[cardNum].isOpen = false;
    // HTML要素の状態を裏にする。
    element.classList.remove("opacity-0");
  } else {
    // 配列のisOpenをtrueに更新
    values[cardNum].isOpen = true;
    // HTML要素の状態を表にする。
    element.classList.add("opacity-0");
  }
}

/**
 * HTMLのカード要素を作成する
 * @param {Number} id
 * @param {string} value
 * @param {boolean} isOpen
 * @returns
 */
function createCard(id, value, isOpen) {
  var cardElement = document.createElement("div");
  cardElement.className = "relative w-[150px] h-[150px] m-auto";
  if (isOpen) {
    // 表の状態で要素を追加
    cardElement.innerHTML = `<div
  class="absolute z-10 bg-card-back text-card-text text-4xl flex items-center justify-center w-full h-full rounded-lg"
>
  ${value}
</div>
<button
  card-num="${id}"
  onclick="toggleCard(this)"
  class="absolute z-20 bg-card-back border border-8 border-input-text text-7xl text-input-text flex items-center justify-center w-full h-full rounded-lg hover:animate-customBounce transition duration-700 ease-in opacity-0"
>
  ?
</button>`;
  } else {
    // 裏の状態で追加
    cardElement.innerHTML = `<div
  class="absolute z-10 bg-card-back text-card-text text-4xl flex items-center justify-center w-full h-full rounded-lg"
>
${value}
  </div>
  <button
    card-num="${id}"
    onclick="toggleCard(this)"
    class="absolute z-20 bg-card-back border border-8 border-input-text text-7xl text-input-text flex items-center justify-center w-full h-full rounded-lg hover:animate-customBounce transition duration-700 ease-in"
  >
  ?
  </button>`;
  }
  return cardElement;
}

/**
 * 配列とシャッフルする回数を受け取り、回数分、配列内の要素を並び替える。
 * @param {Array} arr
 * @param {Number} shuffleNum
 */
function shuffleArray(arr, shuffleNum) {
  for (let i = 0; i < shuffleNum; i++) {
    var x = Math.floor(Math.random() * arr.length);
    var y = Math.floor(Math.random() * arr.length);

    if (x != y) {
      var temp = arr[x];
      arr[x] = arr[y];
      arr[y] = temp;
    }
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 現在の配列valuesの状態をlocalStorageに保存する。
 */
function save() {
  // card-num, win-num, win-mark, lose-markに入力された値を取得
  let cardNum = Number(document.getElementById("card-num").value);
  let winNum = Number(document.getElementById("win-num").value);
  let winMark = document.getElementById("win-mark").value;
  let loseMark = document.getElementById("lose-mark").value;

  const saveData = {
    values: values,
    cardNum: cardNum,
    winNum: winNum,
    winMark: winMark,
    loseMark: loseMark,
  };
  const jsonData = JSON.stringify(saveData);
  localStorage.setItem("lottery-luck", jsonData);
  alert("保存しました。ブラウザ, タブを閉じても問題ありません。");
}

/**
 * localStorageに保存されている配列をvaluesに読み込む。
 */
function load() {
  const jsonData = JSON.parse(localStorage.getItem("lottery-luck"));
  values.length = 0;
  jsonData.values.map(v => {
    values.push(v);
  });
  document.getElementById("card-num").value = jsonData.cardNum;
  document.getElementById("win-num").value = jsonData.winNum;
  document.getElementById("win-mark").value = jsonData.winMark;
  document.getElementById("lose-mark").value = jsonData.loseMark;
  shuffle();
}
