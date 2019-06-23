function queryToObject(query) {
    let qObject = {};
    for (let i = 0; i < query.length; i++) {
        const qSplit = query[i].split('=');
        if (qSplit.length < 2) continue;
        qObject[qSplit[0]] = qSplit[1];
    }
    return qObject;
}

function getId() {
    const url = window.location.href;
    if (url.split('?').length < 2) return 0;
    const query = url.split('?')[1].split('&');
    return parseInt(queryToObject(query).id) || 0;
}

function save(phone) {
    return fetch('/api', {
        method: 'post',
        body: JSON.stringify(phone),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(function (response) {
            return response.json();
        })
        .catch(function (e) {
            alert(e.stack);
        })
}

function getPhone(id) {
    return fetch(`/api/${id}`)
        .then(function (response) {
            return response.json();
        }).catch(function (e) {
            alert(e.stack);
        })
}

$(function () {

    if (getId() !== 0) {
        getPhone(getId()).then(function (data) {
            const phone = data.data;
            $("input[name='name']").val(phone.name);
            $("input[name='phone-number']").val(phone.number);
            $("input[name='email']").val(phone.email);
        })
    }

    $('form').submit(function (e) {
        e.preventDefault();
        const phone = {
            id: getId(),
            name: $("input[name='name']").val(),
            number: $("input[name='phone-number']").val(),
            email: $("input[name='email']").val()
        }

        save(phone).then(function () {
            window.location = '/';
        })
    });
});