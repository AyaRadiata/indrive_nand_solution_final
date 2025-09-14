
// SERVER_PATH = "http://127.0.0.1:5000/detect"


async function sendImages(SERVER_PATH, files) {
    var blobs = []
    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);  // key must match server
    }

    const res = await fetch(SERVER_PATH, {
        method: "POST",
        body: formData,
    });

    const data = await res.json();
    return data
}

const body = document.getElementById('body')
const result_imgs_slider = document.getElementById('result_imgs_slider')

const start_btn = document.getElementById('start_btn')
start_btn.addEventListener("click", (e)=>{
    body.dataset.state = "2"
})

const p1_button = document.getElementById('p1_button')
p1_button.addEventListener("click", (e)=>{
    body.dataset.state = "3"
})

const later_btn = document.getElementById('later_btn');
later_btn.addEventListener("click", (e)=>{
    body.dataset.state = "2"
})

const submit_btn = document.getElementById('submit_btn');
submit_btn.addEventListener("click", (e)=>{
    body.dataset.state = "4"
})

const rating = document.getElementsByClassName('rating')

function changerating(){
    for (let index = 0; index < rating.length; index++) {
    const rating_text = rating[index];
    var rating_scale = rating_text.dataset.rating;
    console.log(rating_scale)
    for (let index = 0; index < rating_scale; index++) {
        rating_text.innerHTML += `<div class="rate_dot" data-rd-check="true" data-rd-col="${rating_scale}"></div>`
    }
    for (let index = 0; index < 5 - rating_scale; index++) {
        rating_text.innerHTML += `<div class="rate_dot"></div>`
    }
}
}

const aidesc = document.getElementById('aidesc')
const result_text_1 = document.getElementById('result_text_1')
const result_text_2 = document.getElementById('result_text_2')
const result_text_1_rate = document.getElementById('result_text_1_rate')
const result_text_2_rate = document.getElementById('result_text_2_rate')

ai_ratings_dirt = []
ai_ratings_damage = []
ai_ratings_final = []
ai_descs = []

const files = document.getElementById('files')
submit_btn.addEventListener('click', (e)=>{
    e.preventDefault()
    sendImages(SERVER_PATH, files.files).then((data)=>{
        results = data.results
        results.forEach(result => {
            url = result.image;
            result_imgs_slider.innerHTML += `
                <div class="res_img_card">
                    <img src="${url}" alt="No Img" class="result_img">
                </div>
            `
        });
        aiRess = data.ai_results
        aiRess.forEach(aiRes => {
            console.log(aiRes, typeof(aiRes))
            ai_ratings_dirt.push(aiRes["dirtiness"])
            ai_ratings_damage.push(aiRes["damage"])
            ai_ratings_final.push(aiRes["final"])
            ai_descs.push(aiRes["desc"])
        });

        const ai_ratings_dirt_sum = ai_ratings_dirt.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        const ai_ratings_dirt_avg = ai_ratings_dirt_sum / ai_ratings_dirt.length;

        const ai_ratings_damage_sum = ai_ratings_damage.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        const ai_ratings_damage_avg = ai_ratings_damage_sum / ai_ratings_damage.length;
        
        const ai_ratings_final_sum = ai_ratings_dirt.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        const ai_ratings_final_avg = ai_ratings_final_sum / ai_ratings_final.length;

        result_text_1_rate.dataset.rating = ai_ratings_dirt_avg
        result_text_2_rate.dataset.rating = ai_ratings_damage_avg

        ai_desc_index = 1
        ai_descs.forEach(ai_desc => {
            aidesc.innerHTML += `<p>${ai_desc_index}: ${ai_desc}</p>`
            ai_desc_index++
        });
        changerating()
    })
    
})

const pop_up = document.getElementById('pop_up');
const popup_title = document.getElementById('popup_title');


seemore = true
popup_title.addEventListener('click', (e)=>{
    if(seemore){
        popup_title.innerHTML = `see less`
        pop_up.style.transform = `translateY(20vh)`
        seemore = false
    } else {
        popup_title.innerHTML = `see more`
        pop_up.style.transform = `translateY(80vh)`
        seemore = true
    }
    
})




