const express = require('express');
const router = express.Router();
const faker = require('faker');
const MAX = 1000;

let phoneBook = [];

const genId = (max) => Math.floor(Math.random() * Math.floor(max))

const genPhone = (max) => {
    return {
        id: genId(max),
        name: faker.name.findName(),
        number: faker.phone.phoneNumber(),
        email: faker.internet.email()
    }
}

const genPhoneBook = (total) => {
    for (let i = 0; i < total; i++) {
        phoneBook.push(genPhone(total))
    }
}

const pagination = (page, limit, phoneBookParam) => {
    limit = limit === 0 ? 10 : limit;
    page = page === 0 ? 1 : page;
    const end = page * limit;
    const start = end - limit;
    return {
        pagination: {
            start,
            end,
            page: parseInt(page),
            isNext: phoneBookParam.length > end,
            isPrev: 0 < start,
        },
        data: phoneBookParam.slice(start, end > phoneBookParam.length ? phoneBookParam.length : end)
    }
}

const isMatch = (k1, k2) => {
    const length = k1.length > k2.length ? k2.length : k1.length;
    for (let i = 0; i < length; i++) {
        const c1 = k1[i].toUpperCase();
        const c2 = k2[i].toUpperCase();
        if (c1 !== c2) return false;
    }

    return true;
}

genPhoneBook(MAX);

router.use(express.json());

router.get('/', (req, res) => {
    const defaultPage = 1;
    const defaultLimit = 10;

    if (req.query.keyword) {
        const find = book => {
            const key = Object.keys(book).find(key => isMatch(book[key].toString(), req.query.keyword))
            return key !== undefined;
        }

        return res.json(pagination(req.query.page || defaultPage, req.query.limit || defaultLimit, phoneBook.filter(find)));
    }
    res.json(pagination(req.query.page || defaultPage, req.query.limit || defaultLimit, phoneBook))
});

router.get('/:id', (req, res) => {
    res.json({ data: phoneBook.find(data => data.id == req.params.id) })
});

router.delete('/:id', (req, res) => {
    phoneBook = phoneBook.filter(book => book.id !== parseInt(req.params.id));
    res.json({ success: true });
});

router.post('/', (req, res) => {
    if (req.body.id === 0) {
        const phone = req.body;
        phone.id = genId(MAX);
        phoneBook = [phone].concat(phoneBook);
    } else {
        const phone = req.body;
        for (let i = 0; i < phoneBook.length; i++) {
            if (phone.id === phoneBook[i].id) {
                phoneBook[i] = phone;
            }
        }
    }
    res.json({ success: true });
});

module.exports = router;