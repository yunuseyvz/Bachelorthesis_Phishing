document.addEventListener('DOMContentLoaded', (event) => {
  document.getElementById('saveButton').addEventListener('click', function() {
    let warningType = document.getElementById('warningType').value;
    // The retrieved value is saved to the local storage.
    browser.storage.local.set({ warningType: warningType })
      .then(() => {
        console.log('Warning type saved:', warningType);
        // optional: Display a confirmation message that the value was saved
        //alert('Warning type changed. Please refresh the email to see the changes.');
      })
      .catch((error) => {
        console.log('Error saving warning type:', error);
      });
  });
});