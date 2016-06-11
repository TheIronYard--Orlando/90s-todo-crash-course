class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  #protect_from_forgery with: :exception

  before_action :take_a_sec
  before_action :find_or_set_user_id
  private

  def find_or_set_user_id
    @user_id = (session[:user_id] ||= SecureRandom.base64)
  end

  def take_a_sec
    sleep 1
  end
end
