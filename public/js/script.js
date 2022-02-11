// menu
document.querySelector(".toggle").onclick = function responsive() {
  var navbar = document.querySelector("nav");
  if (navbar.className === "container") {
    navbar.className += " responsive";
  } else {
    navbar.className = "container";
  }
}
// upload input

$('#file').on('change', function() {
  var file = this.files[0],
      filename = file.name,
      $label = $(this).next('.file-custom'),
      $preview = $('#preview'),
      img = document.createElement("img"),
      reader = new FileReader();
  
  img.file = file;
  img.classList.add("img-responsive");
  $preview.html(img);
  
  reader.onload = (function(aImg) {
    return function(e) {
      aImg.src = e.target.result;
    };
  })(img);

  reader.readAsDataURL(file);
  
  $label
    .attr('data-label', filename)
    .addClass('active');
});






//  // Select Body
//  const bodyElement = document.body;

//  // Select Wrapper
//  const wrapper = document.querySelector('.wrapper');
 
//  // Select Slides Area
//  const slidesArea = document.querySelector('.slides-area');
 
//  // Set Up Slides-Count
//  const slidesCount = slidesArea.childElementCount;
 
//  // Set Up Slides-Count-Minus-One
//  const slidesCountMinusOne = slidesCount - 1;
 
//  // Select Next-Button
//  const nextButton = document.querySelector('.button-next');
 
//  // Select Paginations Area
//  const paginationsArea = document.querySelector('.paginations-area');
 
//  // Set Up Slide-Position
//  let slidePosition = 0;
 
//  // Set Up Move-Value
//  let moveValue = 0;
 
//  // Set Up Unit 
//  let unit = 'px';
 
//  // Functions Definition
//  let updateWrapperWidth;
//  let createPaginationItems;
 
//  // When (nextButton) Has (click) Event
//  nextButton.addEventListener('click', (event) => {
//    // Call Function
//    moveToNextSlide();
//  });
 
//  // When Window Has (resize) Event
//  window.addEventListener('resize', (event) => {
//    // Call Function
//    updateWrapperWidth(wrapper.offsetWidth);
//  });
 
//  // Start Animate Function
//  function moveToNextSlide() {
//    // If Slide-Position Is Equal To Slides-area Children Count Minus One
//    if(slidePosition == slidesCountMinusOne) {
//      // Call Function
//      getStartedActions();
//    }else { // Else
//      // Increase Slide Position
//      slidePosition++;
 
//      // Add On Move-value The Wrapper Width Value 
//      moveValue += wrapper.offsetWidth;
//    }
 
//    // Move The Slides-Area To Left
//    slidesArea.style.marginLeft = `-${moveValue}${unit}`;
 
//    // Call Functions
//    updateNextButton();
//    createPaginationItems();
//  };
 
//  // Update Wrapper Width Function
//  (updateWrapperWidth = function (width) {
//    // Add Alternate Value For The (width) Param
//    width = width || wrapper.offsetWidth;
 
//    // Update The Slides-Area Width
//    slidesArea.style.width = `${width * slidesCount}${unit}`;
   
//    // If Slide Position Value Bigger Than 0
//    if(slidePosition > 0) {
//      // Update Move-value
//      moveValue = width;
 
//      // Move The Slides-Area To Left
//      slidesArea.style.marginLeft = `-${width}${unit}`;
 
//      // If Slide-Position Is Equal To Slides-area Children Count Minus One
//      if(slidePosition === slidesCountMinusOne) {
//        // Move The Slides-Area To Left
//        slidesArea.style.marginLeft = `-${width * slidesCountMinusOne}${unit}`;
//      }
//    }
//  })();
 
//  // Update Next Button Function
//  function updateNextButton() {
//    // Add Class (button-next--fade) 
//    nextButton.classList.add('button-next--fade');
 
//    // After 500 milliseconds
//    setTimeout(() => {
//      // Remove Class (button-next--fade)
//      nextButton.classList.remove('button-next--fade');
//    }, 500);
 
//    // After 550 milliseconds
//    setTimeout(() => {
//      // If Slide-Position Is Equal To Slides-area Children Count Minus One
//      if(slidePosition == slidesCountMinusOne) {
//        // Chnage (nextButton) Text Content
//        nextButton.textContent = 'Get Started';
//        nextButton.href='/dash'
//      }else { // Else
//        // Chnage (nextButton) Text Content
//        nextButton.textContent = 'Next';
//      }
//    }, 550);
//  };
 
//  // Create Pagination Items Function
//  (createPaginationItems = function () {
//    // Empty The Paginations-Area Content
//    paginationsArea.innerHTML = '';
 
//    // Loop On All Slides-Area Children Count
//    for (let i = 0; i < slidesCount; i++) {
//      // Create Pagination Item
//      const paginationItem = '<span class="paginations-area__item"></span>';
 
//      // Add Inner The Pagination-Area The Pagination-Item
//      paginationsArea.innerHTML += paginationItem;
//    };
 
//    // Add Class "paginations-area__item--current" In The Active Item
//    paginationsArea.children[slidePosition].classList.add('paginations-area__item--current');
//  })();
 
//  // Get Started Actions Function
//  function getStartedActions() {
//    // Chnage Background-color
//    bodyElement.style.backgroundColor = 'var(--color-dark)';
//    bodyElement.classList.remove('blur');
//    // Add Class (wrapper--has-fade)
//    wrapper.classList.add('wrapper--has-fade');
//  };