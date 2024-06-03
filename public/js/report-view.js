const rightCol = document.querySelector('.right-col');

const toggleButtonNote = document.getElementById('toggleButtonNote');
const toggleIconNote = document.getElementById('toggleIconNote');


toggleButtonNote.addEventListener('click', function() {
    rightCol.classList.toggle('d-none');
    if (toggleIconNote.classList.contains('bi-chevron-compact-right')) {
      toggleIconNote.classList.remove('bi-chevron-compact-right');
      toggleIconNote.classList.add('bi-chevron-compact-left');
    }
    else {
      toggleIconNote.classList.remove('bi-chevron-compact-left');
      toggleIconNote.classList.add('bi-chevron-compact-right');
    }
  });