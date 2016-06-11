class TodoItemsController < ApplicationController
  before_action :set_todo_item, only: [:show, :edit, :update, :destroy]
  before_action :set_new_item, only: [:edit, :index, :active, :completed]
  before_action :set_all_todos, only: [:index, :edit, :active, :completed]

  def index
    @todo_items = @all_todos
  end

  def edit
    @todo_items = @all_todos
    render :index
  end

  def create
    @todo_item = TodoItem.new(todo_item_params.merge(user_id: @user_id))

    respond_to do |format|
      if @todo_item.save
        format.html { redirect_to root_url, notice: 'Todo item was successfully created.' }
        format.json { render :show, status: :created, location: @todo_item }
      else
        format.html { render :index }
        format.json { render json: @todo_item.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    respond_to do |format|
      if @todo_item.update(todo_item_params)
        format.html { redirect_to root_url, notice: 'Todo item was successfully updated.' }
        format.json { render :show, status: :ok, location: @todo_item }
      else
        format.html { render :edit }
        format.json { render json: @todo_item.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @todo_item.destroy
    respond_to do |format|
      format.html { redirect_to todo_items_url, notice: 'Todo item was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  def active
    @todo_items = @active_todos
    render :index
  end

  def completed
    @todo_items = TodoItem.completed_for_user(@user_id)
    render :index
  end

  def toggle_all
    TodoItem.toggle_all_for_user(@user_id)
    redirect_to root_url
  end

  def clear_completed
    TodoItem.for_user(@user_id).completed.destroy_all
    redirect_to root_url
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_todo_item
      @todo_item = TodoItem.find_by_user(@user_id, params[:id])
    end

    def set_new_item
      @new_todo_item = TodoItem.new
    end

    def set_all_todos
      @all_todos = TodoItem.for_user(@user_id)
      @active_todos = @all_todos.active
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def todo_item_params
      params.require(:todo_item).permit(:text, :complete)
    end
end
