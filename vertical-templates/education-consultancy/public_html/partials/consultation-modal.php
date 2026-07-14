<?php
// Shared enquiry modal (used for the auto "Free Consultation" popup and the "Apply" buttons)
$modalUnis = db()->query('SELECT id, name FROM universities WHERE is_active=1 ORDER BY sort_order, name')->fetchAll();
// Build university -> courses map for the dependent Course dropdown
$modalCourses = [];
foreach (db()->query('SELECT university_id, title FROM courses WHERE is_active=1 ORDER BY sort_order, title') as $c) {
    $modalCourses[(int)$c['university_id']][] = $c['title'];
}
$courseData = [];
foreach ($modalUnis as $mu) { $courseData[$mu['name']] = $modalCourses[(int)$mu['id']] ?? []; }
?>
<div class="modal-overlay" id="consultOverlay">
  <div class="modal">
    <button class="close-x" type="button" onclick="closeConsult()" aria-label="Close">&times;</button>
    <h2 id="consultTitle">Free Expert Consultation</h2>
    <p class="section-sub" style="margin:0 0 16px" id="consultSub">Fill in your details and our team will get back to you shortly.</p>

    <div class="notice ok" id="consultOk" style="display:none">Thank you! Your request has been received. We'll contact you soon.</div>
    <div class="notice bad" id="consultErr" style="display:none"></div>

    <form id="consultForm" onsubmit="return submitConsult(event)">
      <input type="hidden" name="type" id="consultType" value="consultation">
      <input type="hidden" name="csrf" value="<?= e(csrf_token()) ?>">

      <div class="notice" id="applySummary" style="display:none;background:#eef4fc;color:#0b4a8f"></div>

      <div class="form-row"><label>Name</label><input type="text" name="name" required></div>
      <div class="form-row"><label>Date of Birth</label><input type="date" name="dob"></div>
      <div class="form-row"><label>Mobile No</label><input type="tel" name="mobile" required></div>
      <div class="form-row"><label>Email</label><input type="email" name="email" required></div>

      <div class="form-row" id="uniRow">
        <label>University</label>
        <select name="university" id="consultUni" onchange="populateCourses(this.value)">
          <option value="">Select a university</option>
          <?php foreach ($modalUnis as $u): ?><option value="<?= e($u['name']) ?>"><?= e($u['name']) ?></option><?php endforeach; ?>
        </select>
      </div>
      <div class="form-row" id="courseRow">
        <label>Course</label>
        <select name="course" id="consultCourse">
          <option value="">Select a university first</option>
        </select>
      </div>

      <button class="btn" type="submit" style="width:100%">Submit</button>
    </form>
  </div>
</div>

<script>
  window.HAMZA_COURSES = <?= json_encode($courseData, JSON_UNESCAPED_UNICODE) ?>;
</script>
