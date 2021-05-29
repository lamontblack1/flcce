$(document).ready(function () {
  // Getting references to the name input and author container, as well as the table body
  var transactList = $("tbody");
  var transactContainer = $(".transact-container");
  //date formatter
  var DateTime = luxon.DateTime;

  // Adding event listeners to the form to create a new object, and the button to delete
  $(document).on("submit", "#transact-form", handleTransactFormSubmit);
  $(document).on("click", ".delete-transact", handleDeleteButtonPress);
  $(document).on("change", "#dept", populateSubDeptDropdown);

  // Getting the initial list of Authors
  getTransacts();
  populateDeptDropdown();

  // A function to handle what happens when the form is submitted to create a new Author
  function handleTransactFormSubmit(event) {
    event.preventDefault();
    // // Don't do anything if the name fields hasn't been filled out
    // if (!nameInput.val().trim().trim()) {
    //   return;
    // }
    //validation for dropdowns
    if ($("#incomeOrExpense").val() === "Choose...") {
      alert("Please choose Income or Expense");
      return;
    }
    if ($("#forMonth").val() === "Choose...") {
      alert("Please choose what month this is for");
      return;
    }
    if ($("#dept").val().trim() === "Choose...") {
      alert("Please choose Dept");
      return;
    }
    if ($("#subDept").val().trim() === "Choose...") {
      alert("Please choose Sub Dept");
      return;
    }
    if ($("#updatedBy").val().trim() === "Choose...") {
      alert("Please choose who is entering this");
      return;
    }
    //get the date and convert it to SQL format
    let myDate = DateTime.fromFormat($("#itemDate").val().trim(), "M/d/yyyy");
    const newTransact = {
      incomeOrExpense: $("#incomeOrExpense").val().trim(),
      amount: $("#amount").val().trim(),
      invoiceNo: $("#invoiceNo").val().trim(),
      itemDate: myDate.toISODate(),
      forMonthId: parseInt($("#forMonth").val()),
      forYear: parseInt($("#forYear").val().trim()),
      deptId: parseInt($("#dept").val().trim()),
      subDeptId: parseInt($("#subDept").val().trim()),
      checkNo: $("#checkNo").val().trim(),
      payerOrPayee: $("#payerOrPayee").val().trim(),
      description: $("#description").val().trim(),
      note: $("#note").val().trim(),
      updatedBy: $("#updatedBy").val().trim(),
    };
    console.log(newTransact);
    //  createdAt: CURRENT_TIMESTAMP,
    // updatedAt: CURRENT_TIMESTAMP,
    //do the post here
    $.post("/api/transacts", newTransact, function (data) {
      //reset all inputs
      location.reload();
      // $("#transact-form").trigger("reset");
    });
  }

  // Function for creating a new list row for authors
  function createTransactRow(transactData) {
    let myDate = DateTime.fromISO(transactData.itemDate);

    var newTr = $("<tr>");
    newTr.data("transact", transactData);
    newTr.append("<td>" + transactData.incomeOrExpense + "</td>");
    newTr.append("<td>" + transactData.amount + "</td>");
    newTr.append("<td>" + transactData.invoiceNo + "</td>");
    newTr.append("<td>" + myDate.toLocaleString() + "</td>");
    newTr.append("<td>" + transactData.ForMonth.longMonth + "</td>");
    newTr.append("<td>" + transactData.forYear + "</td>");
    newTr.append("<td>" + transactData.Dept.dept + "</td>");
    newTr.append("<td>" + transactData.SubDept.subDept + "</td>");
    newTr.append("<td>" + transactData.checkNo + "</td>");
    newTr.append("<td>" + transactData.payerOrPayee + "</td>");
    newTr.append("<td>" + transactData.description + "</td>");
    newTr.append("<td>" + transactData.note + "</td>");
    newTr.append("<td>" + transactData.updatedBy + "</td>");
    newTr.append(
      "<td><a style='cursor:pointer;color:red' class='delete-transact'>Delete Entry</a></td>"
    );
    return newTr;
  }

  // Function for retrieving authors and getting them ready to be rendered to the page
  function getTransacts() {
    $.get("/api/transacts", function (data) {
      var rowsToAdd = [];
      for (var i = 0; i < data.length; i++) {
        rowsToAdd.push(createTransactRow(data[i]));
      }
      renderTransactList(rowsToAdd);
      //reset all inputs
    });
  }

  // A function for rendering the list of authors to the page
  function renderTransactList(rows) {
    // transactList.children().not(":last").remove();
    // transactContainer.children(".alert").remove();
    // if (rows.length) {
    transactList.append(rows);
    // }
    // else {
    //   renderEmpty();
    // }
  }

  // Function for handling what to render when there are no authors
  // function renderEmpty() {
  //   var alertDiv = $("<div>");
  //   alertDiv.addClass("alert alert-danger");
  //   alertDiv.text("You must create an Author before you can create a Post.");
  //   transactContainer.append(alertDiv);
  // }

  // Function for handling what happens when the delete button is pressed
  function handleDeleteButtonPress() {
    let transactData = $(this).parent("td").parent("tr").data("transact");
    var id = transactData.id;
    $.ajax({
      method: "DELETE",
      url: "/api/transacts/" + id,
    }).then(function () {
      location.reload();
    });
  }

  function populateDeptDropdown() {
    $.get("/api/depts", function (data) {
      let $dept = $("#dept");
      for (var i = 0; i < data.length; i++) {
        $dept.append(
          "<option value=" + data[i].id + ">" + data[i].dept + "</option>"
        );
      }
    });
  }

  function populateSubDeptDropdown() {
    let deptIdVal = parseInt($("#dept").val());
    let $subDept = $("#subDept");
    $subDept.empty();
    $.get("/api/subdeptsbydept/" + deptIdVal, function (data) {
      $subDept.append("<option selected>Choose...</option>");
      for (var i = 0; i < data.length; i++) {
        $subDept.append(
          "<option value=" +
            data[i].id +
            ">" +
            data[i].Dept.dept +
            "-" +
            data[i].subDept +
            "</option>"
        );
      }
    });
  }
});
