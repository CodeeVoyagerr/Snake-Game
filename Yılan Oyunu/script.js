// HTML elementlerini seçtik.
// document.querySelector() DOM (Document Object Model) üzerinde belirtilen bir CSS selektörüne göre ilk eşleşen HTML öğesini seçmek için kullanılır. Bu fonksiyon, belirtilen CSS selektörüne uyan ilk öğeyi döndürür.
const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");

// Oyunun bitip bitmediğini belirleyen değişken
let gameOver =false;

// Yem konumunu tutacak değişken
let foodX , foodY;

// Yılan konumunu tutacak değişken
let snakeX = 5;
let snakeY = 5;

// Yılanın hızını belirleyen değişken
let velocityX = 0 , velocityY = 0;

// Yılanın vücudunu temsil eden dizi
let snakeBody = [];

// Oyun döngüsünü kontrol edecek değişken
let setIntervalId;

// Oyuncu skorunu tutacak değişken 
let score = 0;

/* 
localStorage.getItem(key) JavaScript fonksiyonu, tarayıcıdaki yerel depolama (local storage) alanında belirtilen anahtar (key) ile ilişkilendirilmiş bir değeri almak için kullanılır. 
localStorage'ın avantajları şunlardır:
Veriler tarayıcı kapandıktan sonra bile korunur.
Tarayıcı sekmesi veya penceresi değişse bile verilere erişim sağlar.
Tarayıcı tarafından sunulan basit bir anahtar-değer saklama mekanizmasıdır.

localStorage'ın kapasitesi sınırlıdır ve genellikle 5-10 MB arasındadır.
Güvenlik nedenleriyle, localStorage sadece aynı etki alanına ait sayfalara erişim sağlar. */

// En yüksek skoru localstorage'den alalım
let highScore = localStorage.getItem("high-score") || 0;

// En yüksek skoru ekrana yaz.
// .innerText: Bu özelliği kullanarak, belirtilen HTML öğesinin içerik metnini değiştirir. Yani, önceki içeriği siler ve yerine yeni bir içerik ekler.
highScoreElement.innerText = `Max. Skor : ${highScore}`;

// Yem konumunu rastgele belirleyen fonksiyon
const updateFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
};

// Oyunun sona erdiğini işleyen fonksiyon
/*
const handleGameOver: Bu, oyunun bitim durumunu ele almak için kullanılacak bir işlevin tanımlanmasıdır. 
handleGameOver adında bir değişkene atanmış bir ok fonksiyonudur.
clearInterval(setIntervalId): Eğer oyun içerisinde bir zamanlayıcı (interval) kullanılmışsa, bu satır zamanlayıcıyı temizler ve oyun içinde sürekli olarak çalışan belirli bir fonksiyonun çağrılmasını durdurur. 
setIntervalId değişkeni, bu zamanlayıcıyı temsil eder.
alert("Oyun Bitti ! Tekrar oynamak için TAMAM 'a basın.."): Oyun bittiğinde bir uyarı penceresi görüntüler. Kullanıcıya "Oyun Bitti! Tekrar oynamak için TAMAM'a basın." şeklinde bir mesaj verir.
location.reload(): Sayfanın yeniden yüklenmesini sağlar. 
Bu, kullanıcının "TAMAM" dedikten sonra oyunun baştan başlamasını sağlar. Sayfa tamamen yeniden yüklenir, böylece oyunun başlangıç durumu tekrar oluşturulur ve kullanıcı oyunu yeniden başlatabilir. */

const handleGameOver = () => {
    clearInterval(setIntervalId);
    alert("Oyun Bitti ! Tekrar oynamak için TAMAM 'a basın..");
    location.reload();
};

// Tuşa basıldığında yılanın yönünü değiştiren fonksiyon
// e parametresi, bir olay nesnesini temsil eder ve genellikle "event" kelimesinin kısaltmasıdır. 
// Bu parametre, olayın detaylarını içerir. Fonksiyonun içindeki e.key, kullanıcının hangi tuşa bastığını belirlemek için kullanılır.

const changeDirection = (e) => {

//  Eğer kullanıcı "Yukarı" ok tuşuna basmışsa ve yılan şu anda aşağı yönde hareket etmiyorsa, yılanın hareket yönünü yukarıya değiştirir.
    if(e.key === "ArrowUp" && velocityY !== 1){
        velocityX = 0;
        velocityY = -1;
    } 
    else if(e.key === "ArrowDown" && velocityY !== -1){
        velocityX = 0;
        velocityY = 1;
    }
    else if(e.key === "ArrowLeft" && velocityX !== 1){
        velocityX = -1;
        velocityY = 0;
    }
    else if(e.key === "ArrowRight" && velocityX !== -1){
        velocityX = 1;
        velocityY = 0;
    }
};

// Oyunu başlatan fonksiyon 
const initGame = () => {
    // Eğer oyun sona ermişse , oyunu başlatmadan çık
    if(gameOver) return handleGameOver();

    // Yılanın ve yemin konumunu HTML içeriği olarak oluşturacağız
    let html = `<div class = "food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    // Yılan yemi yemişse 
    if(snakeX === foodX && snakeY === foodY) {
        // Yeni yem konumu belirle
        updateFoodPosition();

        // Yemi yılan vücuduna ekle
        snakeBody.push([foodY,foodX]);

        // Skoru arttır.
        score++;

        // Eğer yeni skor en yüksek skoru geçerse en yüksek skoru güncelle.
        highScore = score >= highScore ? score : highScore;

        // En yüksek skoru localstorage'a kaydet
        localStorage.setItem("high-score",highScore);

        // Skor ve en yüksek skoru ekranda göster
        scoreElement.innerText = `Skor : ${score}`;
        highScoreElement.innerText = `Max. Skor : ${highScore}`;
    }

    // Yılanın başını güncelle 
    snakeX += velocityX ;
    snakeY += velocityY ;

    // Yılanın vücudunu kaydırarak haraket ettir.
    for(let i = snakeBody.length - 1; i>0;i--){
        snakeBody[i] = snakeBody[i-1];
    }

    snakeBody[0] = [snakeX,snakeY];

    // Yılanın tahta dışına çıkıp çıkmadığını kontrol et.
    if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30){
        return (gameOver = true);
    }

    // Yılanın herbir parçasını temsil eden div'leri HTML içeriğine ekle.
    for (let i=0 ; i < snakeBody.length ; i++){
        html += `<div class = "head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;

        // Yılanın başının vücuduyla çarpışıp çarpışmadığını kontrol et
        if(i !== 0 && 
            snakeBody[0][1] === snakeBody[i][1] &&
            snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }

    // Oyun tahtasını güncelle
    // .innerHTML: Bu, bir HTML elemanının içeriğini değiştirmek için kullanılan bir özelliktir. Bu özellik, belirtilen HTML kodu ile bir elemanın içeriğini değiştirebilir.
    playBoard.innerHTML = html;

};

// Oyunu başlatmadan önce yem konumunu belirle
updateFoodPosition();

// Oyun döngüsünü başlat
/*
setInterval fonksiyonu, belirli bir zaman aralığında tekrarlanan işlemleri gerçekleştirmek için kullanılır. 
Bu durumda, initGame fonksiyonu 100 milisaniyede bir çağrılır.*/
setIntervalId = setInterval(initGame,100);

// Klavye tuşlarına basıldığında yılanın yönünü değiştir
/*
Bu satır, belirli bir olay (event) gerçekleştiğinde bir fonksiyonun tetiklenmesini sağlar. 
Bu durumda, "keyup" olayı (klavyeden tuş bırakıldığında) gerçekleştiğinde changeDirection fonksiyonu tetiklenir.*/
document.addEventListener("keyup" , changeDirection);