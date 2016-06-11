class CreateTodoItems < ActiveRecord::Migration[5.0]
  def change
    create_table :todo_items do |t|
      t.string :text
      t.boolean :complete
      t.string :user_id

      t.timestamps
    end
  end
end
