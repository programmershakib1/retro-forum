// @ UTILITIES
class Fetcher {
    constructor(url) {
      this.url = ` https://openapi.programming-hero.com/api/retro-forum/${url}`;
      this.data = null;
    }
    async _fetch() {
      try {
        const response = await fetch(this.url);
        const data = await response.json();
        this.data = data;
        return this;
      } catch (error) {
        console.log(error);
      }
    }
  
    async load(cb) {
      const data = await this._fetch();
      cb(data);
      return this;
    }
  }
  
  class UI {
    constructor(element) {
      if (element.includes("#")) {
        this.element = document.querySelectorAll(element);
      } else {
        this.element = document.getElementById(element);
      }
    }
  
    click(cb) {
      this.element.addEventListener("click", cb);
    }
  
    value() {
      return this.element.value;
    }
  
    render(items) {
      if (!items) this.element.innerHTML = "No data found";
      else this.element.innerHTML = items;
    }
  }
  
  // @ UTILITIES END
  
  // @ COMPONENTS
  const postCard = (post) => {
    const {
      category,
      image,
      author,
      title,
      description,
      comment_count,
      view_count,
      posted_time,
      isActive,
    } = post || {};
  
    return `
    <div>
            <div class="p-6 lg:p-12 flex gap-6 lg:flex-row flex-col items-center lg:items-start bg-[#F3F3F5] rounded-3xl">
        <div class="indicator">
            <span class="indicator-item badge ${
              isActive ? "bg-green-600" : "bg-red-600"
            }"></span>
            <div class="avatar">
                <div class="w-24 rounded-xl">
                <img src="${image}">
                </div>
            </div>
            </div>
            <div class="space-y-4 w-full">
              <div class="flex gap-4 *:opacity-60">
                <p># ${category}</p>
                <p>Author: ${author?.name || "Anonymous"}</p>
            </div>
            <h3 class="text-2xl font-bold opacity-70">
                ${title}
            </h3>
            <p class="opacity-40">
           ${description}
            </p>
            <hr class="border border-dashed border-gray-300">
            <div class="flex justify-between *:font-bold [&amp;>*:not(:last-child)]:opacity-45">
                <div class="flex gap-4">
                <div class="space-x-2 flex items-center">
                    <i class="fa-regular fa-comment-dots" aria-hidden="true"></i>
                    <p>${comment_count}</p>
                </div>
                <div class="space-x-2 flex items-center">
                    <i class="fa-regular fa-eye" aria-hidden="true"></i>
                    <p>${view_count}</p>
                </div>
                <div class="space-x-2 flex items-center">
                    <i class="fa-regular fa-clock" aria-hidden="true"></i>
                    <p>${posted_time} Min</p>
                </div>
                </div>
                <div class="opacity-100">
                <button id="addToList" onclick="markAsRead('${description}','${view_count}')" data-post="{&quot;id&quot;:101,&quot;category&quot;:&quot;Comedy&quot;,&quot;image&quot;:&quot;https://i.ibb.co/0QRxkd5/pexels-jan-kop-iva-3525908.jpg&quot;,&quot;isActive&quot;:true,&quot;title&quot;:&quot;10 Kids Unaware of Their Costume&quot;,&quot;author&quot;:{&quot;name&quot;:&quot;John Doe&quot;},&quot;description&quot;:&quot;It is one thing to subject yourself to a costume mishap&quot;,&quot;comment_count&quot;:560,&quot;view_count&quot;:1568,&quot;posted_time&quot;:5}" class="addToList btn btn-circle bg-green-500 btn-sm">
                    <i class="fa-solid fa-envelope-open text-white" aria-hidden="true"></i>
                </button>
                </div>
            </div>
            </div>
        </div>
            </div>
      `;
  };
  
  const latestPostCard = (post) => {
    const { title, description, cover_image, profile_image, author } = post || {};
    return `
        <div class="card lg:w-96 pb-5 bg-base-100 shadow-2xl">
              <figure class="lg:px-6 px-4 pt-4 lg:pt-8">
                <img src="${cover_image}" alt="Shoes" class="rounded-xl" />
              </figure>
              <div class="p-5 lg:p-10 space-y-4 lg:space-y-5">
                <p class="opacity-50 text-start">
                  <i class="fa-solid fa-calendar-days me-2"></i
                  >${author?.posted_date || "No Publish Date"}
                </p>
                <h2 class="card-title text-start">${title}</h2>
                <p class="text-start">${description}</p>
                <div class="card-actions flex gap-5 items-center">
                  <div class="avatar">
                    <div
                      class="lg:w-12 w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                      <img src="${profile_image}" />
                    </div>
                  </div>
                </div>
                <div>
                  <h3 class="text-start font-extrabold">${
                    author?.name || "Anonymous"
                  }</h3>
                  <p class="text-start opacity-60">
                    ${author?.designation || "Unknown"}
                  </p>
                </div>
              </div>
            </div>
    `;
  };
  
  const markAsReadCard = (post) => {
    const { description, views } = post || {};
  
    return `
      <div class="flex">
          <div class="flex justify-between p-2 lg:p-3 bg-white rounded-2xl items-center gap-3">
              <div class="lg:w-4/5 w-11/12">
                  <p>
                 ${description}
                  </p>
              </div>
              <div class="lg:w-1/5 w-4/12 flex justify-end">
                  <p><i class="fa-regular
                  fa-eye" aria-hidden="true"></i> ${views}</p>
              </div>
          </div>
      </div>
    `;
  };
  
  // @ COMPONENTS END
  
  // @ LOADERS
  const loadDiscussion = (data) => {
    const posts = data?.data?.posts || [];
    const postList = posts.map((post) => postCard(post)).join("");
  
    const postContainer = new UI("post-container");
    postContainer.render(postList);
  };
  
  const loadSearchedPosts = () => {
    const searchInput = new UI("searchPosts").value();
    const searchFetcher = new Fetcher(`posts?category=${searchInput}`);
    searchFetcher.load(loadDiscussion);
  };
  
  const loadLatestPosts = (data) => {
    const posts = data?.data || [];
    const postList = posts.map((post) => latestPostCard(post)).join("");
  
    const latestPostContainer = new UI("latest-post-container");
    latestPostContainer.render(postList);
  };
  
  const read = [];
  const markAsRead = (description, views) => {
    read.push({ description, views });
    const readCard = read.map((post) => markAsReadCard(post)).join("");
  
    const readList = new UI("markAsReadContainer");
    const readCounter = new UI("markAsReadCounter");
    readCounter.render(read.length);
    readList.render(readCard);
  };
  // @ LOADERS END
  
  // @ ACTION EVENTS
  const searchBtn = new UI("searchPostsBtn");
  searchBtn.click(loadSearchedPosts);
  
  // @ FETCHER INIT
  const discussion = new Fetcher("posts");
  discussion.load(loadDiscussion);
  
  const latestPosts = new Fetcher("latest-posts");
  latestPosts.load(loadLatestPosts)