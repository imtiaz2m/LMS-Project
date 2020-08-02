function createRow(objArr) {
    var tr = $(document.createElement('tr'));

    for (const obj of objArr) {
        var td = $(document.createElement('td'));
        if (obj.type === 'text') {
            td.html(obj.data);
            td.addClass(obj.textClass)
        }
        else if (obj.type === 'btn') {
            var btn = $(document.createElement('a'));
            btn.attr('href', '#');
            btn.attr('doc_id', obj.docId);
            btn.addClass('btn ' + obj.btnType);
            btn.html(obj.data);

            td.append(btn);
        }

        tr.append(td);
    }

    return tr;
}


function createDropzoneItem(item) {
    var li = $(document.createElement('li'));
    li.addClass('list-group-item');

    var a = $(document.createElement('a'));
    a.attr('href', item.path);
    a.html(item.filename);

    li.append(a);

    var aBtn = $(document.createElement('a'));
    aBtn.addClass('btn btn-icon btn-sm float-right');
    aBtn.attr('href', '#');
    aBtn.html('<i class="fas fa-times text-danger"></i>');

    li.append(aBtn);

    return li;
}

function isNumberKey(evt){
    var charCode = (evt.which) ? evt.which : evt.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    return true;
}
