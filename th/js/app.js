function createURL(args) {
    var queryString = "";
    var keys = Object.keys(args);
    for (i = 0; i < keys.length; i++) {
        queryString += ((i == 0) ? "?" : "&") + keys[i] + "=" + args[keys[i]];
    }
    return queryString;
}

function getQueryStringArgs() {
    var qs = (location.search.length > 0 ? location.search.substring(1) : '');
    var args = {};
    var items = qs.length ? qs.split('&') : [];
    var item = null;
    var name = null;
    var value = null;
    for (i = 0; i < items.length; i++) {
        item = items[i].split('=');
        name = decodeURIComponent(item[0]);
        value = decodeURIComponent(item[1]);
        if (name.length) {
            args[name] = value;
        }
    }
    return args;
}

function printObject(o) {
    var out = "";
    for (var p in o) {
        out += p + ': ' + o[p] + '\n';
    }
    alert(out);
}

function getHomePage() {
    var args = getQueryStringArgs();
    window.location.href = "Page/page1.html" + createURL(args);
}

function getPage1() {
    var args = getQueryStringArgs();
    window.location.href = "page2.html" + createURL(args);
}

function getPage2() {
    disease = document.getElementById('disease').value;
    allergy = document.getElementById('allergy').value;

    if (disease.length == 0) disease = "-";
    if (allergy.length == 0) allergy = "-";

    var args = getQueryStringArgs();
    args["disease"] = disease;
    args["allergy"] = allergy;
    window.location.href = "page3.html" + createURL(args);
}

function getPage3() {
    weight = document.getElementById('weight').value;
    height = document.getElementById('height').value;
    var args = getQueryStringArgs();
    args["weight"] = weight;
    args["height"] = height;
    window.location.href = "page4.html" + createURL(args);
}

function getPage6() {
    var args = getQueryStringArgs();
    window.location.href = "page7.html" + createURL(args);
}