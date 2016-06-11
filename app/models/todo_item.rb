class TodoItem < ApplicationRecord

  scope :active, -> {where(complete: false).or(where(complete: nil))}
  scope :completed, -> {where(complete: true)}

  class << self

    def toggle_all_for_user(user_id)
      if TodoItem.any_active_for_user?(user_id)
        TodoItem.complete_all_for_user(user_id)
      else
        TodoItem.reactivate_all_for_user(user_id)
      end
    end

    def any_active_for_user?(user_id)
      for_user(user_id).active.any?
    end

    def complete_all_for_user(user_id)
      for_user(user_id).active.update_all(complete: true)
    end

    def completed_for_user(user_id)
      for_user(user_id).completed
    end

    def find_by_user(user_id, id)
      for_user(user_id).find(id)
    end

    def for_user(user_id)
      where(user_id: user_id)
    end

    def reactivate_all_for_user(user_id)
      completed_for_user(user_id).update_all(complete: false)
    end
  end
end
