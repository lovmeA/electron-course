window.onload = function () {
    Vue.config.productionTip = false
    new Vue({
        el: 'body',
        data: {
            keyword: '',
            courseClass: '',
            courseList: [],
            subjectList: []
        },
        methods: {
            async onKeywordQueryChange() {
                this.subjectList = []
                if (this.keyword === '') {
                    this.onSelectCourseChange()
                    return
                }
                await db.getCourseSearch(this.courseClass, this.keyword).then(result => {
                    this.subjectList = result
                })
            },
            async onSelectCourseChange() {
                this.subjectList = []
                if (this.courseClass === '') {
                    this.keyword = ''
                    return
                }
                await db.getCourseAllData(this.courseClass).then(result => {
                    this.subjectList = result
                })
            },
            isImage(txt) {
                return txt.search('<img alt="\\w+.\\w+" src="data:\\w+/\\w+;base64,') !== -1
            }
        },
        created: function () {
        },
        mounted: function () {
            db.courseList.then(result => {
                this.courseList = result
            })
        }
    });
}