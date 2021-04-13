const $noteTitle = $(".note-title");
const $noteText = $(".note-textarea");
const $saveNoteBtn = $(".save-note");
const $newNoteBtn = $(".new-note");
const $noteList = $(".list-container .list-group");

//One let keeps track of active not in textarea
let activeNote = {};

//function to get all notes from DB
const getNotes = () => {
  return $.ajax({
    url: "/api/notes",
    method: "GET",
  });
};

// Will save notes to the DB
const saveNote = (note) => {
  return $.ajax({
    url: "/api/notes",
    data: note,
    method: "POST",
  });
};

//Deletes a not from the DB
const deleteNote = (id) => {
  return $.ajax({
    url: "api/notes/" + id,
    method: "DELETE",
  });
};

// Re wrote code saying if active note, display it otherwise render empty
const renderActiveNote = () => {
  $saveNoteBtn.hide();

  if (activeNote.id) {
    $noteTitle.attr("readonly", true);
    $noteText.attr("readonly", true);
    $noteTitle.val(activeNote.title);
    $noteText.val(activeNote.text);
  } else {
    $noteTitle.attr("readonly", false);
    $noteText.attr("readonly", false);
    $noteTitle.val("");
    $noteText.val("");
  }
};

//Get note data from the inputs and save it to database
const handleNoteSave = function () {
  const newNote = {
    title: $noteTitle.val(),
    text: $noteText.val(),
  };

  saveNote(newNote).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

//Function for deleting a note that's clicked
const handleNoteDelete = function (event) {
  // prevents the click listener
  event.stopPropagation();

  const note = $(this).parent(".list-group-item").data();

  if (activeNote.id === note.id) {
    activeNote = {};
  }

  deleteNote(note.id).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// Sets and displays the note that's active
const handleNoteView = function () {
  activeNote = $(this).data();
  renderActiveNote();
};

//Active note is an empty object allows user to enter new one
const handleNewNoteView = function () {
  activeNote = {};
  renderActiveNote();
};


// Won't allow an empty title or text, hides save button if so
// Or show it when filled
const handleRenderSaveBtn = function () {
  if (!$noteTitle.val().trim() || !$noteText.val().trim()) {
    $saveNoteBtn.hide();
  } else {
    $saveNoteBtn.show();
  }
};

// provides list of NOtes titles
const renderNoteList = (notes) => {
  $noteList.empty();

  const noteListItems = [];

  // Returns jquery item with text and a delete button
  // -Unless false.
  const create$li = (text, withDeleteButton = true) => {
    const $li = $("<li class='list-group-item'>");
    const $span = $("<span>").text(text);
    $li.append($span);
//Checks for delete button
    if (withDeleteButton) {
      const $delBtn = $(
      "<i class='fas fa-trash-alt float-right text-danger delete-note'>"
    );
    $li.append($delBtn);
      }
      return $li;
    };
//If length or text = 0 generate No saved notes text
    if (notes.length === 0) {
      noteListItems.push(create$li("No saved Notes", false));
    }
  // For each note create an LI
    notes.forEach((note) => {
      const $li = create$li(note.title).data(note);
      noteListItems.push($li);
    });
  
    $noteList.append(noteListItems);
  };
  
  // Gathers notes form db and displays on side
  const getAndRenderNotes = () => {
    return getNotes().then(renderNoteList);
  };
  //What to do on click
  $saveNoteBtn.on("click", handleNoteSave);
  $noteList.on("click", ".list-group-item", handleNoteView);
  $newNoteBtn.on("click", handleNewNoteView);
  $noteList.on("click", ".delete-note", handleNoteDelete);
  $noteTitle.on("keyup", handleRenderSaveBtn);
  $noteText.on("keyup", handleRenderSaveBtn);
  
  // Gets and renders initial list
  getAndRenderNotes();
