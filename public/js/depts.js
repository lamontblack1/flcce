$(document).ready(function () {
  // Getting a reference to the input field where user adds a new dept
  var $newItemInput = $("input.new-item");
  var $newSubDeptInput = $("#newSubDeptInput");
  var $newSubItemDeptInput = $("#deptDropdown");
  // Our new depts will go inside the dept-container
  var $deptContainer = $(".dept-container");
  var $subDeptContainer = $(".subDept-container");

  var $deptForNewSubDeptInput = $("#deptDropdown");
  // Adding event listeners for deleting, editing, and adding todos
  // $(document).on("click", "button.delete", deleteDept);
  // $(document).on("click", "button.complete", toggleComplete);
  $(document).on("click", ".dept-item", editDept);
  $(document).on("keyup", ".dept-item", finishEdit);
  $(document).on("blur", ".dept-item", cancelEdit);
  $(document).on("submit", "#dept-form", insertDept);

  // $(document).on("click", "button.deleteSubDept", deleteSubDept);
  // $(document).on("click", "button.complete", toggleComplete);
  $(document).on("click", ".sub-dept-item", editSubDept);
  $(document).on("keyup", ".sub-dept-item", finishSubDeptEdit);
  $(document).on("blur", ".sub-dept-item", cancelSubDeptEdit);
  $(document).on("submit", "#subDept-form", insertSubDept);

  //still must add same functionality for subDepts list, plus making forDept dropdown list

  // Our initial todos array
  var depts = [];
  var subDepts = [];

  // Getting depts from database when page loads
  getDepts();
  getSubDepts();

  // This function resets the depts displayed with new depts from the database, and populates the deptDropdown
  function initializeRows() {
    $deptContainer.empty();
    // also use this function to populate the dropdown used for associating subDepts with depts
    $deptForNewSubDeptInput.empty();
    var rowsToAdd = [];
    for (var i = 0; i < depts.length; i++) {
      rowsToAdd.push(createNewRow(depts[i]));

      // deal with deptDropdown
      //****************************************************************still have to add deptId to data
      $deptForNewSubDeptInput.append(
        "<option value=" + depts[i].id + ">" + depts[i].dept + "</option>"
      );
    }
    $deptContainer.prepend(rowsToAdd);
  }

  function initializeSubDeptRows() {
    $subDeptContainer.empty();
    var rowsToAdd = [];
    for (var i = 0; i < subDepts.length; i++) {
      rowsToAdd.push(createNewSubDeptRow(subDepts[i]));
    }
    $subDeptContainer.prepend(rowsToAdd);
  }

  // This function grabs depts from the database and updates the view
  function getDepts() {
    $.get("/api/depts", function (data) {
      depts = data;
      initializeRows();
    });
  }

  function getSubDepts() {
    $.get("/api/subdepts", function (data) {
      subDepts = data;
      initializeSubDeptRows();
    });
  }

  // This function deletes a subDept when the user clicks the delete button
  // function deleteDept(event) {
  //   event.stopPropagation();
  //   var id = $(this).data("id");
  //   $.ajax({
  //     method: "DELETE",
  //     url: "/api/depts/" + id,
  //   }).then(getDepts);
  // }

  // This function handles showing the input box for a user to edit a dept
  function editDept() {
    var currentDept = $(this).data("dept");
    $(this).children().hide();
    $(this).children("input.edit").val(currentDept.dept);
    $(this).children("input.edit").show();
    $(this).children("input.edit").focus();
  }

  function editSubDept() {
    var currentSubDept = $(this).data("sub-dept");
    $(this).children().hide();
    $(this).children("sub-input.edit").val(currentSubDept.subDept);
    $(this).children("sub-input.edit").show();
    $(this).children("sub-input.edit").focus();
  }

  // Toggles complete status
  // function toggleComplete(event) {
  //   event.stopPropagation();
  //   var dept = $(this).parent().data("dept");
  //   dept.complete = !dept.complete;
  //   updateDept(dept);
  // }

  // This function starts updating a dept in the database if a user hits the "Enter Key"
  // While in edit mode
  function finishEdit(event) {
    var updatedDept = $(this).data("dept");
    if (event.which === 13) {
      updatedDept.text = $(this).children("input").val().trim();
      $(this).blur();
      updateDept(updatedDept);
    }
  }

  function finishSubDeptEdit(event) {
    var updatedSubDept = $(this).data("sub-dept");
    if (event.which === 13) {
      updatedSubDept.text = $(this).children("input").val().trim();
      $(this).blur();
      updateSubDept(updatedSubDept);
    }
  }

  // This function updates a dept in our database
  function updateDept(dept) {
    $.ajax({
      method: "PUT",
      url: "/api/dept",
      data: dept,
    }).then(getDepts);
  }

  function updateSubDept(subDept) {
    $.ajax({
      method: "PUT",
      url: "/api/subdept",
      data: subDept,
    }).then(getSubDepts);
  }

  //left off here

  // This function is called whenever a todo item is in edit mode and loses focus
  // This cancels any edits being made
  function cancelEdit() {
    var currentDept = $(this).data("dept");
    if (currentDept) {
      $(this).children().hide();
      $(this).children("input.edit").val(currentDept.dept);
      $(this).children("span").show();
      $(this).children("button").show();
    }
  }

  function cancelSubDeptEdit() {
    var currentSubDept = $(this).data("subDept");
    if (currentSubDept) {
      $(this).children().hide();
      $(this).children("input.edit").val(currentSubDept.subDept);
      $(this).children("span").show();
      $(this).children("button").show();
    }
  }

  // This function constructs a dept row
  function createNewRow(deptInfo) {
    // console.log(deptInfo);
    var $newInputRow = $(
      [
        "<li class='list-group-item dept-item'>",
        "<span>",
        deptInfo.dept,
        "</span>",
        "<input type='text' class='edit' style='display: none;'>",
        // "<button class='delete btn btn-danger'>x</button>",
        "</li>",
      ].join("")
    );

    $newInputRow.find("button.delete").data("id", deptInfo.id);
    $newInputRow.find("input.edit").css("display", "none");
    $newInputRow.data("dept", deptInfo);

    return $newInputRow;
  }

  function createNewSubDeptRow(subDeptInfo) {
    // console.log(deptInfo);
    var $newInputRow = $(
      [
        "<tr>",
        "<th>",
        subDeptInfo.Dept.dept,
        "</th>",
        "<th>",
        subDeptInfo.subDept,
        "</th>",
        // "<button class='delete btn btn-danger'>x</button>",
        "</tr>",
      ].join("")
    );

    $newInputRow.find("button.delete").data("id", subDeptInfo.id);
    $newInputRow.find("input.edit").css("display", "none");
    $newInputRow.data("dept", subDeptInfo);

    return $newInputRow;
  }

  // This function inserts a new dept into our database and then updates the view
  function insertDept(event) {
    event.preventDefault();
    var dept = {
      dept: $newItemInput.val().trim(),
    };

    $.post("/api/depts", dept, getDepts);
    $newItemInput.val("");
  }

  function insertSubDept(event) {
    event.preventDefault();
    var newSubDept = {
      subDept: $newSubDeptInput.val().trim(),
      deptId: $newSubItemDeptInput.val().trim(),
    };
    $.post("/api/subdepts", newSubDept, getSubDepts);
    $newSubDeptInput.val("");
    $newSubItemDeptInput.val("");
  }
});
