Rails.application.routes.draw do
  root to: "todo_items#index"
  resources :todo_items do
    collection do
      post :toggle_all
      post :clear_completed
      get :active
      get :completed 
    end
  end
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
