const {contextBridge, ipcRenderer} = require('electron')
const path = require('path')

const knex = require('knex')({
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
        filename: 'db.sqlite3'
    },
})

const dict = {'一': 0, '二': 1, '三': 2, '四': 3, '五': 4, '六': 5, '七': 6, '八': 7, '九': 8, '十': 9}
const getCourseAllData = async (courseName) => {
    let temp = await knex.schema.raw(`SELECT DISTINCT paper_part as 'paperPart' FROM "ws_course" WHERE "course"='${courseName}' ORDER BY paper_part`).then(async (result) => {
        let numList = []
        for (let item of result) {
            let title = item.paperPart.split('（')[0]
            await knex.schema.raw(`SELECT id,title,answer_option,answer FROM "ws_course" WHERE "course"='${courseName}' AND "paper_part" LIKE '${title}%'`).then(data => {
                numList[dict[title.split('、')[0]]] = {title: title, data: data}
            })
        }
        return numList
    })
    let dataList = []
    for (let item of temp) {
        if (item === undefined) continue
        dataList.push(item)
    }
    return ipcRenderer.invoke('getCourseAllData', dataList)
}

const getCourseSearch = async (cn, kw) => {
    let temp = await knex.schema.raw(`SELECT DISTINCT paper_part as 'paperPart' FROM "ws_course" WHERE "course"='${cn}' AND ("title" LIKE '%${kw}%' OR "answer_option" LIKE '%${kw}%' OR "answer" LIKE '%${kw}%') ORDER BY paper_part`).then(async (result) => {
        let numList = []
        for (let item of result) {
            let title = item.paperPart.split('（')[0]
            await knex.schema.raw(`SELECT id,title,answer_option,answer FROM "ws_course" WHERE "course"='${cn}' AND "paper_part" LIKE '${title}%' AND ("title" LIKE '%${kw}%' OR "answer_option" LIKE '%${kw}%' OR "answer" LIKE '%${kw}%')`).then(data => {
                numList[dict[title.split('、')[0]]] = {title: title, data: data}
            })
        }
        return numList
    })
    let dataList = []
    for (let item of temp) {
        if (item === undefined) continue
        dataList.push(item)
    }
    return ipcRenderer.invoke('getCourseSearch', dataList)
}

contextBridge.exposeInMainWorld('db', {
    getCourseAllData,
    getCourseSearch,
    courseList: knex.schema.raw(`SELECT DISTINCT course FROM \`ws_course\``).then(item => {
        return item
    })
})