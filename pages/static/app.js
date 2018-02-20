// Hides change-button and show up-to-date-button
function showUpToDateButton() {
  $("#change-button").hide();
  $("#up-to-date-button").show();
}

// Hides up-to-date-button and show change-button
function showChangeButton() {
  $("#up-to-date-button").hide();
  $("#change-button").show();
}

// Converts an array of objects to an array of arrays
// because DataTable accepts data in the format array of arrays.
function convertDataset(dataset) {
  var dataArray = [];
  dataset.forEach(function(jsonObject) {
    dataArray.push([jsonObject.date, jsonObject.filename, jsonObject.action,
      jsonObject["submit-type"], jsonObject.rating]);
  });
  return dataArray;
}

// Filter data based on specified time frame
function filterData(dataset, timeFrame) {
  // minTime is 24hours, 7 days, or 4 weeks before current time (based on user's selection)
  var minTime;
  switch(timeFrame) {
    case "hours":
      minTime = moment().subtract(24, 'hours');
      break;
    case "days":
      minTime = moment().subtract(7, 'days');
      break;
    case "weeks":
      minTime = moment().subtract(28, 'days');
      break;
    default: // timeFrame = all
      minTime = moment(0);
  }
  // compare dates using moment objects
  return dataset.filter(function(file) {
    var date = file.date;
    var momentDate = moment(date, 'MMM D, YYYY H:mm:ss');
    // return true if the file's date is after minTime
    return momentDate.isAfter(minTime);
  });
}

var timeFrame = "all";

// Populates the datatable with data from dataset
function populateTable(dataset, table) {
  // Remove all rows from the table
  table.rows().remove().draw();

  // Filter dataset based on the time frame
  var filteredData = filterData(dataset, timeFrame);

  // Convert the files from dataset to array of arrays format
  dataArray = convertDataset(filteredData);

  // Loop through each file in the dataArray
  dataArray.forEach(function(file) {
    // Add the current file to a row in the datatable
    var row  = table.row.add(file).draw().node();
    // Add the row's rating as its class so it will have the corresponding background color
    $(row).addClass(file[4]);
  });
}

$(document).ready(function() {
  // Gives the rating column a customizable sort with decreasing order as following:
  // malicious, high-risk, medium-risk, low-risk, clean
  $.fn.dataTable.enum(['malicious', 'high-risk', 'medium-risk', 'low-risk', 'clean']);

  // Custom sort the date column in the specific date format: MMM D, YYYY H:mm:ss
  $.fn.dataTable.moment('MMM D, YYYY H:mm:ss');

  var prevData, dataArray, table;

  // Initialize datatable with column headers
  table = $('#table').DataTable({
    data: [],
    columns: [
      {title: "Date"},
      {title: "Filename"},
      {title: "Action"},
      {title: "Submit-Type"},
      {title: "Rating"}
    ]
  });

  // Calls fetchdata API to fetch data
  $.get("/fetchdata", function(dataset){
    // Populate datatable with files from dataset
    populateTable(dataset.files, table);

    // The data in the datatable is now up to date so we let the user know by showing the up-to-date-button
    showUpToDateButton();
    // Updates prevData to be the current dataset
    prevData = dataset;

    // Update timeFrame when there is a change in the selection box,
    // and populate table according to the selected time frame.
    $(".target").change(function(evt){
      timeFrame = this.value;
      populateTable(prevData.files, table);
    });

    // For every second
    setInterval(function() {
      // Calls fetchdata API to fetch data
      $.get("/fetchdata", function(dataset){

        // Checks if metafiles have changed. If yes, allow user to reload table. Else, continue.
        if (!_.isEqual(prevData,dataset)) {
          // Prompt user metafiles have changed. Click the change-button to reload datatable.
          showChangeButton();

          // When user clicks on the change-button
          $("#change-button").click(function() {
            // Remove all the rows from the table
            table.rows().remove();

            // Populate datatable with updated metafiles
            populateTable(dataset.files, table);

            // The data in the datatable is now up to date so we let the user know by showing the up-to-date-button
            showUpToDateButton();
          });
        }
        // updates prevData to be the current dataset
        prevData = dataset;
      })
      },
    1000);
  });

})
