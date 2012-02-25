function sivamtime() {
    function azero(v) { if (v<=9) { v="0"+v; } return v; }
    now=new Date();
    hour=now.getHours();
    min=azero(now.getMinutes());
    sec=azero(now.getSeconds())
    if (hour>12) { hour=hour-12; add="pm"; }
    else { hour=hour; add="am"; }
    if (hour==12) { add="pm"; }
    time = azero(hour) + ":" + min + ":" + sec + " " + add;
    if (document.getElementById) { document.getElementById('thetime').innerHTML = time; }
    else if (document.layers) {
        document.layers.theTime.document.write(time);
        document.layers.theTime.document.close(); }
    setTimeout("sivamtime()", 1000);
}
sivamtime();
