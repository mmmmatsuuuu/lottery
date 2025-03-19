// tailwind設定
tailwind.config = {
  theme: {
    extend: {
      colors: {
        "back": "#FAF3E0",
        "button-back": "#00897B",
        "button-text": "#FFFFFF",
        "card-back": "#FFFAFA",
        "card-text": "#424242",
        "input-back": "#E0F2F1",
        "input-text": "#00695C",
      },
      keyframes: {
        customBounce: {
          '0%, 100%': { transform: 'translateY(-10%)' },
          '50%': { transform: 'translateY(0)' },
        },
      },
      animation: {
        customBounce: 'customBounce 1s infinite',
      },
    }
  }
}

/**
 * value : 表示する値
 * isOpen: カードの値が表示されている状態かどうか。true->表示, false->非表示 
 */
const values = [
  {value: 1, isOpen: false},
  {value: 2, isOpen: false},
  {value: 3, isOpen: false},
  {value: 4, isOpen: false},
];

/**
 * start-valueとend-valueに入力された値から配列valuesを初期化
 * valuesの要素をランダムに並べ替える
 * card-containerにvaluesの値が入ったカードを表示する。
 */
async function handOutCard() {
  // start-valueとend-valueに入力された値を取得
  let startValue = Number(document.getElementById("start-value").value);
  let endValue   = Number(document.getElementById("end-value").value);
  
  if (startValue > endValue) {
    var temp = startValue;
    startValue = endValue;
    endValue = temp;
  }

  // 配列の初期化
  values.length = 0;
  for (let i = startValue; i <= endValue; i++) {
    var temp = { value: i, isOpen: false };
    values.push(temp);
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
    var cardElement = createCard(values[i].value, values[i].isOpen);
    container.appendChild(cardElement);
    await sleep(2000/values.length);
  }
  console.log(values);
}

/**
 * 現在の配列valuesの状態をlocalStorageに保存する。
 */
function save() {
  const jsonData = JSON.stringify(values);
  localStorage.setItem("lottery-tomi", jsonData);
  alert("保存しました。ブラウザ, タブを閉じても問題ありません。");
}

/**
 * localStorageに保存されている配列をvaluesに読み込む。
 */
function load() {
  const jsonData = JSON.parse(localStorage.getItem("lottery-tomi"));
  values.length = 0;
  let min = jsonData[0].value;
  let max = jsonData[0].value;
  jsonData.map(j => {
    values.push(j);
    if (min > j.value) min = j.value;
    if (max < j.value) max = j.value;
  });
  document.getElementById("start-value").value = min;
  document.getElementById("end-value").value = max;
  shuffle();
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
    if (values[i].value == value) {
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
 * @param {Number} value 
 * @param {boolean} isOpen 
 * @returns 
 */
function createCard(value, isOpen) {
  var cardElement = document.createElement("div");
  cardElement.className = "relative w-[150px] h-[150px] m-auto";
  if (isOpen) {
    // 表の状態で要素を追加
    cardElement.innerHTML = `<div
  class="absolute z-10 bg-card-back text-card-text text-7xl flex items-center justify-center w-full h-full rounded-lg"
>
  ${ value }
</div>
<button
  card-num="${ value }"
  onclick="toggleCard(this)"
  class="absolute z-20 bg-card-back border border-8 border-input-text text-7xl text-input-text flex items-center justify-center w-full h-full rounded-lg hover:animate-customBounce transition duration-700 ease-in opacity-0"
>
  ?
</button>`;

} else {
  // 裏の状態で追加
  cardElement.innerHTML = `<div
  class="absolute z-10 bg-card-back text-card-text text-7xl flex items-center justify-center w-full h-full rounded-lg"
>
${ value }
  </div>
  <button
    card-num="${ value }"
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
  return new Promise(resolve => setTimeout(resolve, ms));
}