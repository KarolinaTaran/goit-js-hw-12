import{S as L,a as f,i as d}from"./assets/vendor-89feecc5.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))a(t);new MutationObserver(t=>{for(const n of t)if(n.type==="childList")for(const u of n.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&a(u)}).observe(document,{childList:!0,subtree:!0});function r(t){const n={};return t.integrity&&(n.integrity=t.integrity),t.referrerpolicy&&(n.referrerPolicy=t.referrerpolicy),t.crossorigin==="use-credentials"?n.credentials="include":t.crossorigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function a(t){if(t.ep)return;t.ep=!0;const n=r(t);fetch(t.href,n)}})();const m="41588863-34d6c5c01e7f0c7c667666520",l=document.querySelector("#search-input"),b=document.querySelector("#image-container"),i=document.querySelector(".loader"),C=document.querySelector("#search-form"),v=new L("#image-container a",{captionsData:"alt",captionDelay:250}),p=document.querySelector(".load-more-btn"),o={currentPage:1,totalHits:0,query:""},c=document.querySelector(".image-card");let g;C.addEventListener("submit",$);p.addEventListener("click",k);function $(s){if(s.preventDefault(),o.query=l.value.trim(),!o.query){y(),h();return}i.style.display="block";const e=`https://pixabay.com/api/?key=${m}&q=${o.query}&image_type=photo&orientation=horizontal&safesearch=true&page=${o.currentPage}&per_page=40`;f.get(e).then(r=>{const a=r.data;i.style.display="none",Array.isArray(a.hits)&&a.hits.length>0?(o.totalHits=a.totalHits,q(a.hits),v.refresh(),l.value="",setTimeout(()=>{w()},0),o.currentPage++):(y(),h(),o.totalHits===0?d.show({message:"Sorry, there are no images matching your search query. Please try again!",messageColor:"white",backgroundColor:"red",position:"topRight"}):(d.show({message:"We're sorry, but you've reached the end of search results.",messageColor:"white",backgroundColor:"orange",position:"topRight"}),l.value="",o.currentPage=1))}).catch(r=>{i.style.display="none",console.error("Error!",r)})}function q(s){s.map(e=>{const r=`
      <div class="image-card">
        <a href="${e.largeImageURL}">
          <img src="${e.webformatURL}" alt="${e.tags}">
          <div class="image-info">
            <p><strong>Likes:</strong> ${e.likes}</p>
            <p><strong>Views:</strong> ${e.views}</p>
            <p><strong>Comments:</strong> ${e.comments}</p>
            <p><strong>Downloads:</strong> ${e.downloads}</p>
          </div>
        </a>
      </div>
    `;b.innerHTML+=r}),c&&(g=c.getBoundingClientRect().height)}function y(){b.innerHTML=""}function w(){p.style.display="block"}function h(){p.style.display="none"}function k(){if(o.query=l.value.trim(),o.currentPage<=Math.ceil(o.totalHits/40)){i.style.display="block";const s=`https://pixabay.com/api/?key=${m}&q=${o.query}&image_type=photo&orientation=horizontal&safesearch=true&page=${o.currentPage}&per_page=40`;f.get(s).then(e=>{const r=e.data;i.style.display="none",Array.isArray(r.hits)&&r.hits.length>0&&(q(r.hits),v.refresh(),o.currentPage++,c&&(g=c.getBoundingClientRect().height,S(g)),setTimeout(()=>{w()},0))}).catch(e=>{i.style.display="none",console.error("Error!",e)})}else h(),d.show({message:"We're sorry, but you've reached the end of search results.",messageColor:"white",backgroundColor:"orange",position:"topRight"})}function S(s){c&&window.scrollBy({top:s,left:0,behavior:"smooth"})}
//# sourceMappingURL=commonHelpers.js.map