const apiBaseURL = 'http://localhost:3000/api';
function composePhone(phone) {
    return `<div class='grid-item'> 
        <b>${phone.name}</b>
        <br>  
        ${phone.number}
        <br>
        ${phone.email}
        <br>
        <button class='delete' phone-id=${phone.id}> delete </button>
    </div>`
}

function composePhoneBook(phoneBook) {
    const phoneBookElement = [];
    for (let i = 0; i < phoneBook.length; i++) {
        phoneBookElement.push(composePhone(phoneBook[i]));
    }

    return `<div class='grid-container'> ${phoneBookElement.join('')} </div>`
}

function reactNextPrevButton(isNext, isPrev) {
    if (!isNext) $('#next').attr('disabled', true);
    else $('#next').attr('disabled', false);

    if (!isPrev) $('#prev').attr('disabled', true);
    else $('#prev').attr('disabled', false);
}

function renderPhoneBook(phoneBook) {
    $('div').html(composePhoneBook(phoneBook));
    $('.delete').click(function (e) {
        const id = $(this).attr('phone-id');
        deletePhoneBook(id).then(function () {
            const keyword = $('input').val();
            fetchRender(null, { page: getPage(), keyword }).then(data => {
                reactNextPrevButton(data.pagination.isNext, data.pagination.isPrev);
                setPage(data.page);
            });
        })
    });
}

function fetchRender(path, query) {
    const url = path ? `${apiBaseURL}/${path}` : apiBaseURL;
    const queryString = (query) => {
        if (!query) return '';
        const queryArr = [];
        Object.keys(query).forEach(key => queryArr.push(`${key}=${query[key]}`));
        return queryArr.join('&');
    }
    return fetch(`${url}?${queryString(query)}`)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            renderPhoneBook(data.data || data);
            return data;
        })
        .catch(function (e) {
            alert(e.stack);
        })
}

function deletePhoneBook(id) {
    const url = `${apiBaseURL}/${id}`;
    return fetch(url, { method: 'delete' })
        .then(function (response) {
            return response.json();
        })
        .catch(function (e) {
            alert(e.stack);
        })
}

let page = 1;

function setPage(page) {
    page = page;
}

function getPage() {
    return page;
}

function addPage() {
    return page++;
}

function minPage() {
    return page--;
}

$(function () {
    fetchRender().then(data => reactNextPrevButton(data.pagination.isNext, data.pagination.isPrev));

    $('#search').click(function (e) {
        const keyword = $('input').val();
        if (keyword === '') {
            return fetchRender().then(data => reactNextPrevButton(data.pagination.isNext, data.pagination.isPrev));
        }
        fetchRender(null, { keyword, page: 1 }).then(data => {
            reactNextPrevButton(data.pagination.isNext, data.pagination.isPrev);
            setPage(1);
        });
    });

    $('#next').click(function (e) {
        addPage();
        const keyword = $('input').val();
        fetchRender(null, { page: getPage(), keyword }).then(data => {
            reactNextPrevButton(data.pagination.isNext, data.pagination.isPrev);
            setPage(data.page);
        });
    });

    $('#prev').click(function (e) {
        minPage();
        const keyword = $('input').val();
        fetchRender(null, { page: getPage(), keyword }).then(data => {
            reactNextPrevButton(data.pagination.isNext, data.pagination.isPrev);
            setPage(data.page);
        });
    })
})


