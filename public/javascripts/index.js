(function() {
  var socket = io();

  var tableRows = document.querySelectorAll('table tr');

  function highlight(row) {
    row.classList.add('highlight');
    var fn;
    row.addEventListener(
      'animationend',
      (fn = function(e) {
        row.classList.remove('highlight');
        row.removeEventListener('animationend', fn);
      })
    );
  }

  function updateTable() {}
  socket.on('tableupdate', function(data) {
    data.forEach(function(datum) {
      var index = datum.id - 17059 + 1;
      const isLate = datum.attending_time && new Date(datum.attending_time).getHours() >= 7;
      const row = tableRows[index];
      const attendanceStatusCol = row.children[2];
      attendanceStatusCol.children[0].classList.remove(...['tidakhadir', 'hadir']);
      const attended = datum.attended;
      attendanceStatusCol.children[0].textContent = attended ? 'HADIR' : 'TIDAK HADIR';
      attendanceStatusCol.children[0].classList.add(attended ? 'hadir' : 'tidakhadir');
      attendanceStatusCol.children[1].textContent = isLate ? 'TERLAMBAT' : '';
      const timeAttendedCol = row.children[3];
      timeAttendedCol.textContent = datum.attending_time
        ? new Date(datum.attending_time).toLocaleTimeString()
        : 'N/A';

      // if

      tableRows[index].children[3].textContent = new Date(
        datum.attending_time
      ).toLocaleTimeString();
      highlight(tableRows[index]);
    });
  });
})();
