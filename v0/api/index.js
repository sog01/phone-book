const { Router } = require('express');
const router = Router();
const faker = require('faker');

let phoneBook = [];

const genPhone = (max) => {
    return {
        id: Math.floor(Math.random() * Math.floor(max)),
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

genPhoneBook(1000);

router.get('/', (req, res) => {
    const defaultPage = 1;
    const defaultLimit = 10;

    if (req.query.keyword) {
        const find = book => {
            const key = Object.keys(book).find(key => book[key].toString() === req.query.keyword)
            return key !== undefined;
        }

        return res.json(pagination(req.query.page || defaultPage, req.query.limit || defaultLimit, phoneBook.filter(find)));
    }
    res.json(pagination(req.query.page || defaultPage, req.query.limit || defaultLimit, phoneBook))
});

router.delete('/:id', (req, res) => {
    phoneBook = phoneBook.filter(book => book.id !== parseInt(req.params.id));
    res.json({ success: true });
});

module.exports = router;