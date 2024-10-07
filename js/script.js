// this function fetches the main API
const fetchData = async (id = "1000") => {
    const data = await fetch(`https://openapi.programming-hero.com/api/videos/category/${id}`);
    const gotData = await data.json();
    // console.log(gotData);    
    checkStatus(gotData);
    // showAllDefault(gotData);
    sortBlogs(gotData);
}
fetchData();

const cardsContainer = document.getElementById('main-container');
let sortByViews = false;
// this function checks if there is any data present or not
const checkStatus = (gotData) => {
    // console.log(gotData.status);
    const dataStatus = gotData.status;
    if (dataStatus && gotData.data != []) {
        // console.log("The status is OK!");
        showAllDefault(gotData);
    }
    else {
        cardsContainer.innerHTML = `
        <div class="mt-10 md:mt-32 flex flex-col items-center justify-center gap-8 w-auto md:w-[440px] mx-auto px-3">
            <div><img src="./assets/Icon.png" alt=""></div>
            <p class="text-[#171717] text-3xl md:text-4xl font-bold text-center">Oops!! Sorry, There is no <br> content here</p>
        </div> `;
    }
}

// show cards in main container
const showAllDefault = (gotData) => {
    // console.log(gotData);
    cardsContainer.innerHTML = "";
    let dataArray;
    if (sortByViews) {
        dataArray = gotData;
        console.log("sorted by views");
    }
    else {
        console.log("not sorted by views");
        dataArray = gotData.data;
    }
    dataArray.forEach(data => {
        // console.log(data.authors[0].verified);
        const timeStamp = toHourAndMinutes(data.others.posted_date);
        // console.log(timeStamp);
        const div = document.createElement('div');
        div.innerHTML = `
        <div class="flex flex-col gap-3">
                <div class="rounded-md overflow-hidden relative">
                    <img src="${data.thumbnail}" alt="" class="h-[200px] w-full object-cover">
                    ${timeStamp ? `<p class="showTime absolute bg-[#171717] text-white bottom-2 right-2 py-1 px-2 rounded-md text-xs">${timeStamp}</p>` : ''}
                </div>
                <div class="flex gap-3 items-start">
                    <div class="border-2 w-[40px] h-[40px] flex items-center justify-center rounded-full overflow-hidden flex-shrink-0">
                        <img src="${data.authors[0].profile_picture}" alt="">
                    </div>
                    
                    <div class="flex flex-col gap-1">
                        <p class="text-[#171717] font-bold">${data.title}</p>
                        <p class="flex items-center gap-2 text-[#171717B2]"><span>${data.authors[0].profile_name}</span>${data.authors[0].verified ? `<img src="./assets/fi_10629607.png" alt=""></img>` : ''}</p>
                        <p class="text-[#171717B2]"><span>${data.others.views}</span> views</p>
                    </div>
                </div>
            </div>`
        cardsContainer.appendChild(div);
    });

}


const categories = document.querySelectorAll('.tag');
// fetch data according to clicked category
function handleCategoryClick(event) {
    sortByViews = false;
    // add and remove background color on click
    categories.forEach(tags => {
        tags.classList.remove("bg-[#FF1F3D]");
        tags.classList.remove("text-white");
    });
    event.currentTarget.classList.add("bg-[#FF1F3D]");
    event.currentTarget.classList.add("text-white");

    const selectedCategory = event.target.innerHTML;
    if (selectedCategory === 'All') {
        // console.log("Show all Vlogs!");
        fetchData();
    } else if (selectedCategory === 'Music') {
        // console.log("Show Music Vlogs!");
        fetchData("1001");
    } else if (selectedCategory === 'Comedy') {
        // console.log("Show Comedy Vlogs!");
        fetchData("1003");
    } else if (selectedCategory === 'Drawing') {
        // console.log("Show Drawing Vlogs!");
        fetchData("1005");
    }
}

categories.forEach(category => {
    category.addEventListener('click', handleCategoryClick);
});

// function to convert time from second to hour and minute
const toHourAndMinutes = (gotTime) => {
    if (gotTime === "") {
        // console.log("empty");
        return '';
    }
    else {
        second = parseInt(gotTime);
        if (second >= 3600) {
            const toHour = Math.floor(second / 3600);
            const rem = second % 3600;
            const toMinute = Math.floor(rem / 60);

            return `${toHour} hrs ${toMinute} min ago`;
        }
        else if (second >= 60 && second <= 3600) {
            const toMinute = Math.floor(second / 60);
            return `${toMinute} min ago`;
        }
        else {
            return `${second} hrs ago`;
        }
    }
}

const sortByViewsButton = document.getElementById('sortByView');

// Function to sort blogs by views in descending order
function sortBlogs(blogData) {
    sortByViewsButton.addEventListener('click', function () {
        const sortedBlogs = [...blogData.data];
        sortedBlogs.sort((a, b) => removeLetterFromString(b.others.views) - removeLetterFromString(a.others.views));
        // console.log(sortedBlogs);
        if (blogData.status == false) {
            checkStatus(blogData);
        }
        else {
            sortByViews = true;
            showAllDefault(sortedBlogs);
        }
    });
};

// function to convert views string to numbers 
const removeLetterFromString = (str) => {
    // const newString = str.slice(0, -1);
    const newString = str.substring(0, str.length - 1);
    const toNum = parseFloat(newString);
    return toNum;
}

