(function ($) {
  $.fn.juicer = function (options) {
    const $SELECTOR = $(this);

    let opts = $.extend({
      limit: 8,
      feed_more: $('.juicer-button'),
      btn_msg: 'View More'
    }, options);

    const init_limit = opts.limit;

    opts.feed_more.on('click', function (e) {
      if (opts.limit > 0) {
        opts.limit = 0;
        $(this).text('View Less');
      } else {
        opts.limit = init_limit;
        $(this).text(opts.btn_msg);
      }

      e.preventDefault();
    });

    $.ajax({
      url: 'https://www.juicer.io/api/feeds/juicer',
      method: 'GET',
      dataType: 'json',
      success: function (data) {
        let c = 1;
        let html = '';
 
        for (let item of data.posts.items) {
          if (item.unformatted_message != null) {
            var text = item.unformatted_message.replace(/<\/?[^>]+(>|$)/g, '');
          } else {
            var text = " ";
          }
          const img = item.image;

          if (img) {
            html += `
                <div>
                    <a href="${item.full_url}" target="_blank" style="background-image: url('${img}');">
                        <span>${text}</span>
                    </a>
                </div>
            `;
          } else {
            html += `
                <div>
                    <a href="${item.full_url}" target="_blank">
                        <span style="opacity: 1;">${text}</span>
                    </a>
                </div>
            `;
          }

          if (opts.limit > 0 && c++ >= opts.limit) {
            $SELECTOR.html(html);
            return false;
          }
        }

        $SELECTOR.html(html);

        if (opts.limit === 0) {
          $('#feed > div').css('display', 'block');
        }
      },
      error: function () {
        console.log('Error loading feed.');
      }
    });
  };
})(jQuery);