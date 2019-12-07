module.exports = {
  HTML:function(title, subTitle, firstContent, secondContent){
    return `
    <!doctype html>
    <html>
    <head>
      <!-- Bootstrap CSS -->
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
      
      <title>${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
    <div class="card">
      <h2 class="display-4 ml-3 mt-3">${title}</h2>
    </div>
      <div class="container ml-0 mt-3">
        <div class="row">
          <div class="col-sm">
            <p class="lead ml-2">${subTitle}</p>
          </div>
        </div>
        <div class="row">
          <div class="col-sm">
            ${firstContent}
          </div>
          <div class="col-sm">
            ${secondContent}
          </div>
        </div>
      </div>
      <!-- Optional JavaScript -->
      <!-- jQuery first, then Popper.js, then Bootstrap JS -->
      <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossorigin="anonymous"></script>
      <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
      <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>
    </body>
    </html>
    `;
  },list:function(filelist){
    var list = '<ul class="list-group">';
    var i = 0;
    while(i < filelist.length){
      list = list + `<li class="list-group-item"><a href="/parse/${filelist[i]}">${filelist[i]}</a></li>`;
      i = i + 1;
    }
    list = list+'</ul>';
    return list;
  }
}
