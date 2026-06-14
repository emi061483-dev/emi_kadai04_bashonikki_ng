// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  set,
  onChildAdded,
} from "https://www.gstatic.com/firebasejs/9.1.0/firebase-database.js";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  databaseURL: "",
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app); //RealtimeDBに接続
const dbRef = ref(db, "chat"); //RealtimeDB内の"chat"を使う

//データ登録(Click)
$("#send").on("click", function () {
  const placename = $("#placename").val();
  const text = $("#text").val();
  const mapUrl = createMapUrl(placename);

  const msg = {
    placename: placename,
    text: text,
    rating: rating,
    mapUrl: mapUrl,
    createdAt: Date.now(),
  };

  const newPostRef = push(dbRef);

  set(newPostRef, msg);

  $("#placename").val("");
  $("#text").val("");
  rating = 0;
  ratingValue.textContent = rating;
  updateStars();
});
//データ登録(Enter)
onChildAdded(dbRef, function (data) {
  const msg = data.val();
  const key = data.key;
  const mapUrl = msg.mapUrl || createMapUrl(msg.placename || "");
  const createdAtText = formatDate(msg.createdAt);

  let html = `
                <div class="post-card">
                    <div class="post-main">
                      <h3>${msg.placename}</h3>
                      <p class="post-date">${createdAtText}</p>
                      <p class="post-text">${msg.text}</p>
                    </div>
                    <p class="post-rating">${renderStars(msg.rating || 0)}</p>
                    <a class="map-link" href="${mapUrl}" target="_blank" rel="noopener noreferrer">Googleマップで見る</a>
                </div>
            `;

  // jQueryを使って画面に表示
  $("#output").prepend(html);
});


//星評価機能用
let rating = 0;

const stars = document.querySelectorAll("#ratingStars button");
const ratingValue = document.getElementById("ratingValue");

stars.forEach((star) => {
  star.addEventListener("click", () => {
    rating = Number(star.dataset.value);
    ratingValue.textContent = rating;
    updateStars();
  });
});

function updateStars() {
  stars.forEach((star) => {
    const value = Number(star.dataset.value);

    if (value <= rating) {
      star.textContent = "★";
    } else {
      star.textContent = "☆";
    }
  });
}

function renderStars(value) {
  return "★".repeat(value) + "☆".repeat(5 - value);
}

function createMapUrl(placename) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(placename)}`;
}

function formatDate(timestamp) {
  if (!timestamp) {
    return "日時なし";
  }

  const date = new Date(timestamp);
  return date.toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
