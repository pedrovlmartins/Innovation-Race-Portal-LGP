const hbs = require('hbs');

module.exports = {
    addPagination: function (page, pageNo, pageTotal, keyword) {
        var out = '';
        if (pageNo !== 1) {
            if (keyword === '') {
                out += '<li><a id="left" href="' + page + '?'
                    + 'page=' + (pageNo - 1) + '">&laquo;</a></li>\n';
            } else {
                out += '<li><a id="left" href="' + page + '?keyword=' + keyword
                    + '&page=' + (pageNo - 1) + '">&laquo;</a></li>\n';
            }
        }

        for (var number = 1; number <= pageTotal; ++number) {
            /* If the page is not the first one, the last one, or the 2 before and after the
             current page, it's not displayed */
            if (number >= (pageNo + 3) || (number <= (pageNo - 3)))
                if (number !== 1 && number !== pageTotal)
                    continue;
            if (pageNo === number)
                out += '<li class="active">';
            else out += '<li>';
            if (keyword === '') {
                out += '<a id="page' + number + '" href="' + page + '?'
                    + 'page=' + number + '">' + number + '</a></li>';
            } else {
                out += '<a id="page' + number + '" href="' + page + '?keyword=' +
                    keyword + '?page=' + number + '">' + number + '</a></li>';
            }
        }

        if (pageNo < pageTotal) {
            if (keyword === '') {
                out += '<li><a id="right" href="' + page
                    + '?page=' + (pageNo + 1) + '">&raquo;</a></li>\n';
            } else {
                out += '<li><a id="right" href="' + page + '?keyword=' + keyword
                    + '&page=' + (pageNo + 1) + '">&raquo;</a></li>\n';
            }
        }

        return new hbs.SafeString(out);
    },
};