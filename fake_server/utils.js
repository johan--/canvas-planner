const moment = require('moment-timezone');

const getKindaUniqueId = () => Math.floor(Math.random() * (100000 - 1) + 1).toString();

const generateStatus = (overrides) => {
  if (overrides) { return overrides; }
  const statusArray = [];
  const baseStatusDecider = Math.floor(Math.random() * (10000 - 1)) % 4;
  let isLate = false;
  switch (baseStatusDecider) {
    case 0:
      statusArray.push('graded');
      isLate = Math.random() > 0.5;
      if (isLate) {
        statusArray.push('late');
      }
      break;
    case 1:
      statusArray.push('excused');
      break;
    case 2:
      statusArray.push('submitted');
      isLate = Math.random() > 0.5;
      if (isLate) {
        statusArray.push('late');
      }
      break;
    default:
      const isMissing = Math.random() > 0.5;
      if (isMissing) {
        statusArray.push('missing');
      }
      break;
  }

  return statusArray;
};

const generateActivity = (isDiscussion = false, overrides) => {
  if (overrides) { return overrides; }
  const activityArray = [];
  const activityDecider = Math.floor(Math.random() * (10000 - 1)) % 3;
  switch (activityDecider) {
    case 0:
      activityArray.push('new_grades');
      break;
    case 1:
      activityArray.push('new_feedback');
      break;
    default:
      break;
  }

  if (isDiscussion && (Math.random() > 0.5)) {
    activityArray.push('new_replies');
  }
};

const createFakeAssignment  = (name, courseId = "1", dueDateTime = moment(), completed = false, status = [], activity = []) => {
  const id = getKindaUniqueId();

  return {
    id: id, // This is NOT part of the Canvas API but is required for JSON Server
    status: status,
    activity: activity,
    context_type: "Course",
    course_id: courseId,
    type: "submitting",
    ignore: `/api/v1/users/self/todo/assignment_${id}/submitting?permanent=0`,
    ignore_permanently: `/api/v1/users/self/todo/assignment_${id}/submitting?permanent=1`,
    visible_in_planner: true,
    planner_override: null,
    plannable_type: 'assignment',
    plannable: {
      id: id,
      description: "<p>Lorem ipsum etc.</p>",
      due_at: dueDateTime.tz('UTC').format(),
      unlock_at: null,
      lock_at: null,
      points_possible: 50,
      grading_type: "points",
      assignment_group_id: "2",
      grading_standard_id: null,
      created_at: "2017-05-12T15:05:48Z",
      updated_at: "2017-05-12T15:05:48Z",
      peer_reviews: false,
      automatic_peer_reviews: false,
      position: 1,
      grade_group_students_individually: false,
      anonymous_peer_reviews: false,
      group_category_id: null,
      post_to_sis: false,
      moderated_grading: false,
      omit_from_final_grade: false,
      intra_group_peer_reviews: false,
      secure_params: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9",
      course_id: courseId,
      name: name,
      submission_types: [
        "online_text_entry",
        "online_upload"
      ],
      has_submitted_submissions: completed,
      due_date_required: false,
      max_name_length: 255,
      in_closed_grading_period: false,
      is_quiz_assignment: false,
      muted: false,
      html_url: `/courses/${courseId}/assignments/${id}`,
      published: true,
      only_visible_to_overrides: false,
      locked_for_user: false,
      submissions_download_url: `/courses/${courseId}/assignments/${id}/submissions?zip=1`
    },
    html_url: `/courses/${courseId}/assignments/${id}#submit`
  };
};

const createFakeDiscussion = (name, courseId = "1", dueDateTime = moment(), completed = false, status = [], activity = []) => {
  const id = getKindaUniqueId();

  return {
    id: id, // This is NOT part of the Canvas API but is required for JSON Server
    status: status,
    activity: activity,
    context_type: "Course",
    course_id: courseId,
    type: "submitting",
    ignore: `/api/v1/users/self/todo/assignment_${id}/submitting?permanent=0`,
    ignore_permanently: `/api/v1/users/self/todo/assignment_${id}/submitting?permanent=1`,
    visible_in_planner: true,
    planner_override: null,
    plannable_type: 'discussion_topic',
    plannable: {
      id: "1",
      title: name,
      last_reply_at: "2017-05-15T16:32:34Z",
      delayed_post_at: null,
      posted_at: "2017-05-15T16:32:34Z",
      assignment_id: id,
      root_topic_id: null,
      position: null,
      podcast_has_student_posts: false,
      discussion_type: "side_comment",
      lock_at: null,
      allow_rating: false,
      only_graders_can_rate: false,
      sort_by_rating: false,
      user_name: "clay@instructure.com",
      discussion_subentry_count: 0,
      permissions: {
        attach: false,
        update: false,
        reply: true,
        delete: false
      },
      require_initial_post: null,
      user_can_see_posts: true,
      podcast_url: null,
      read_state: "unread",
      unread_count: 0,
      subscribed: false,
      topic_children: [],
      attachments: [],
      published: true,
      can_unpublish: false,
      locked: false,
      can_lock: false,
      comments_disabled: false,
      author: {
        id: "1",
        display_name: "Carl Chudyk",
        avatar_image_url: "http://canvas.instructure.com/images/messages/avatar-50.png",
        html_url: `/courses/${courseId}/users/1`
      },
      html_url: `/courses/${courseId}/discussion_topics/${id}`,
      url: `/courses/${courseId}/discussion_topics/${id}`,
      pinned: false,
      group_category_id: null,
      can_group: true,
      locked_for_user: false,
      message: "<p>Some prompt</p>",
      todo_date: dueDateTime.tz('UTC').format(),
      // have to add this because json server doesn't have the capability to do both due_at and todo_date
      due_at: dueDateTime.tz('UTC').format(),
    },
    html_url: `/courses/${courseId}/assignments/${id}#submit`
  };
};

const createFakeQuiz = (name, courseId = "1", dueDateTime = moment(), completed = false, status = [], activity = []) => {
  const id = getKindaUniqueId();

  return {
    id: id, // This is NOT part of the Canvas API but is required for JSON Server
    status: status,
    activity: activity,
    context_type: "Course",
    course_id: courseId,
    type: "submitting",
    ignore: `/api/v1/users/self/todo/assignment_${id}/submitting?permanent=0`,
    ignore_permanently: `/api/v1/users/self/todo/assignment_${id}/submitting?permanent=1`,
    visible_in_planner: true,
    planner_override: null,
    plannable_type: 'quiz',
    plannable: {
      id: 2,
      title: name,
      html_url: `/courses/${courseId}/quizzes/${id}`,
      mobile_url: `/courses/${courseId}/quizzes/${id}?force_user=1\u0026persist_headless=1`,
      description: "\u003cp\u003easdfasdf\u003c\/p\u003e",
      quiz_type: "assignment",
      time_limit: null,
      shuffle_answers: false,
      show_correct_answers: true,
      scoring_policy: "keep_highest",
      allowed_attempts: 1,
      one_question_at_a_time: false,
      question_count: 0,
      points_possible: 0.0,
      cant_go_back: false,
      ip_filter: null,
      due_at: dueDateTime.tz('UTC').format(),
      lock_at: null,
      unlock_at: null,
      published: true,
      locked_for_user: false,
      hide_results: null,
      show_correct_answers_at: null,
      hide_correct_answers_at: null,
      all_dates: [
        {
          due_at: dueDateTime.tz('UTC').format(),
          unlock_at: null,
          lock_at: null,
          base: true
        }
      ],
      can_update: false,
      require_lockdown_browser: false,
      require_lockdown_browser_for_results: false,
      require_lockdown_browser_monitor: false,
      lockdown_browser_monitor_data: null,
      permissions: {
        read_statistics: false,
        manage: false,
        read: true,
        update: false,
        create: false,
        submit: true,
        preview: false,
        delete: false,
        grade: false,
        review_grades: false,
        view_answer_audits: false
      },
      quiz_reports_url: `/courses/${courseId}/quizzes/${id}/reports`,
      quiz_statistics_url: `/courses/${courseId}/quizzes/${id}/statistics`,
      quiz_submission_versions_html_url: `/courses/${courseId}/quizzes/${id}/submission_versions`,
      assignment_id: 6,
      one_time_results: false,
      assignment_group_id: 1,
      show_correct_answers_last_attempt: false,
      version_number: 2,
      question_types: [],
      has_access_code: false,
      post_to_sis: false
    },
    html_url: `/courses/${courseId}/quizzes/${id}`
  };
};

const createFakeWiki = (name, courseId = "1", dueDateTime = moment(), completed = false, status = [], activity = []) => {
  const id = getKindaUniqueId();

  return {
    context_type: 'Course',
    course_id: courseId,
    status: status,
    activity: activity,
    type: 'viewing',
    ignore: `/api/v1/users/self/todo/wiki_page_${id}/viewing?permanent=0`,
    ignore_permanently: `/api/v1/users/self/todo/wiki_page_${id}/viewing?permanent=1`,
    visible_in_planner: true,
    planner_override: null,
    plannable_type: 'wiki_page',
    plannable: {
      title: name,
      created_at: '2017-06-05T14:48:47Z',
      url: 'bgg-wiki',
      editing_roles: 'teachers',
      page_id: id,
      last_edited_by: {
        id: 1,
        display_name: 'Carl',
        avatar_image_url: 'http://canvas.instructure.com/images/messages/avatar-50.png',
        html_url: '/courses/1/users/1'
      },
      published: true,
      hide_from_students: false,
      front_page: false,
      html_url: '/courses/1/pages/bgg-wiki',
      todo_date: dueDateTime.tz('UTC').format(),
      updated_at: '2017-06-05T14:48:47Z',
      locked_for_user: false,
      body: ''
    },
    html_url: 'bgg-wiki'
  };
};



module.exports = {
  createFakeAssignment,
  createFakeDiscussion,
  createFakeQuiz,
  createFakeWiki,
  getKindaUniqueId,
  generateStatus,
  generateActivity
};
