/* $(document).ready(function(){
    $('a[data-confirm]').on('click','excluir', function(){
        var href = $(this).attr('href');
        if(!$('#confirm-delete').length){
            $('body').append(<div class="modal fade" id="confirm-delete" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">Excluir Item<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">Tem certeza que deseja excluir o item selecionado?</div>
      <div class="modal-footer">
        <button type="button" class="btn btn-sucess" data-bs-dismiss="modal">Cancelar</button>
        <a class="btn btn-danger text-white" id="data-donfirmOK">Excluir</a>
      </div>
    </div>
  </div>
</div>

            );
        }
        $('#data-donfirmOK').attr('href', href);
        $('#confirm-delete').modal({shown:true});
        return false;
    });
}); */