// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBsF1HuQ9GBrZvyNTkYOgNyPV8ol6Q8aFw",
    authDomain: "fir-database-tutorial-da6d1.firebaseapp.com",
    databaseURL: "https://fir-database-tutorial-da6d1.firebaseio.com",
    projectId: "fir-database-tutorial-da6d1",
    storageBucket: "fir-database-tutorial-da6d1.appspot.com",
    messagingSenderId: "389765521726",
    appId: "1:389765521726:web:5a51beea5efa1ec3e98c6f",
    measurementId: "G-1EQ8DE3R6S"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const bmi = firebase.database().ref('bmi');
$('.seeResult').click(function () {
    const height = $('#height').val() / 100;
    const weight = $('#weight').val();
    const calcul = (weight / (height * height)).toFixed(2);
    const time = new Date();

    if (height == '' || weight == '') {
        alert('請輸入身高 體重');
    } else {
        let year = time.getFullYear();
        let month = ('0' + (time.getMonth()+1)).slice( -2 );
        let day = time.getDate();
        let date = `${month}-${day}-${year}`;
        let bmiStatus = getStatus(calcul);

        bmi.push({
            'result': calcul,
            'height': height,
            'weight': weight,
            'date': date,
            'status': bmiStatus,
        });
        $('.seeResult').css('display', 'none');
        $('.result').css({
            'display': 'flex',
            'color': bmiStatus.color
        });
        $('.result div:first-child').css('border', `6px solid ${bmiStatus.color}`);
        $('.result-index').text(bmiStatus.text);
        $('.result-tryAgain').css('background-color', bmiStatus.color);
    }
});

// 清除
$('.result-tryAgain').click(function () {
    $('.result').css('display', 'none');
    $('.seeResult').css('display', 'block');
    $('#height').val('');
    $('#weight').val('');
});

// 刪除
$('#list').on('click', '.listItem-deletebtn', function () {
    var key = $(this).data('key');
    bmi.child(key).remove();
});

bmi.on('value', function (snapshot) {
    let str = '';
    const array = [];
    snapshot.forEach(function (item) {
        array.push({
            key: item.key,
            val: item.val()
        });
    });
    // 翻轉
    array.reverse();

    array.forEach(function (item) {
        str += `
        <li class="listItem" style="border-left: 6px solid ${item.val.status.color}">
            <div>${item.val.status.text}</div>
            <div><span>BMI</span>${item.val.result}</div>
            <div><span>weight</span>${item.val.weight}kg</div>
            <div><span>height</span>${item.val.height * 100}cm</div>
            <div>${item.val.date}</div>
            <a href="#" class="listItem-deletebtn" data-key="${item.key}"><i class="far fa-trash-alt"></i></a>
        </li>
        `
    });

    $('#list').html(str);
});


function getStatus(num) {
    switch (true) {
        case (num < 18.5):
            return {
                text: '體重過輕',
                color: '#31BAF9'
            };
        case (num >= 18.5 && num < 24):
            return {
                text: '正常範圍',
                color: '#86D73E'
            };
        case (num >= 24 && num < 27):
            return {
                text: '過重',
                color: '#FF982D'
            };
        case (num >= 27 && num < 30):
            return {
                text: '輕度肥胖',
                color: '#FF6C02'
            };
        case (num >= 30 && num < 35):
            return {
                text: '中度肥胖',
                color: '#FF6C02'
            };
        case (num >= 35):
            return {
                text: '重度肥胖',
                color: '#FF1200'
            };
        default:
            return 'Error';
    }
}
