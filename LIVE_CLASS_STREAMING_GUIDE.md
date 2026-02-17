# Live Class HLS Video Streaming Setup

## Overview
This document explains how the live class video streaming system works with time-based access control and automated email delivery.

## How It Works

### 1. Student Registration Flow

When a student registers for **Grade 12 Physics** class:

1. Student fills the registration form on `/live-classes/india`
2. Form data is submitted to `/api/leads`
3. System creates a lead record with:
   - Student details (name, email, phone)
   - Grade and subjects
   - Unique access code (token)

### 2. Automated Email Delivery

The system automatically sends an email to registered students with:

- **Subject**: 🎥 Your Live Class Link - Grade 12 Revision
- **Content**: Welcome message, registered subjects, and classroom link
- **Link Format**: 
  ```
  https://eduaitutors.com/live-classroom?
    grade=Grade%2012&
    subject=Physics&
    token=<unique-access-code>&
    videoUrl=https://d36f5jgespoy2j.cloudfront.net/12%20phy%20edit_720.m3u8&
    startTime=2026-02-17T13:30:00+05:30
  ```

### 3. Live Classroom Page Behavior

When students click the link, they see different content based on timing:

#### Before Class Starts (UPCOMING)
- **Countdown Timer** showing:
  - Days, Hours, Minutes, Seconds until class starts
  - Message: "The live stream will automatically start when the class begins"
- Students can stay on the page and wait

#### When Class Starts (LIVE)
- **HLS Video Player** automatically loads and plays
- Shows "🔴 Live Now" indicator
- Full video controls (play, pause, volume, fullscreen)
- Video URL: `https://d36f5jgespoy2j.cloudfront.net/12%20phy%20edit_720.m3u8`

#### After Class Ends (ENDED)
- Shows "Class Has Ended" message
- Link to view other classes

### 4. Technical Implementation

#### HLS Video Player
- Uses `hls.js` library for HLS stream playback
- Supports both:
  - Modern browsers (via hls.js)
  - Safari/iOS (native HLS support)
- Auto-recovery from network/media errors

#### Time-Based Access Control
- Countdown timer calculates time difference from current time to start time
- Class status automatically updates:
  - `UPCOMING` → `LIVE` → `ENDED`
- Video player only initializes when status is `LIVE`

## Configuration

### Grade 12 Physics Class Details

- **Subject**: Physics
- **Grade**: Grade 12
- **Start Time**: Feb 17, 2026 at 1:30 PM IST
- **Duration**: 4 hours
- **Video Stream**: HLS (.m3u8 format)
- **Video URL**: `https://d36f5jgespoy2j.cloudfront.net/12%20phy%20edit_720.m3u8`

### Adding More Classes

To add video streaming for other classes, update `/app/api/leads/route.ts`:

```typescript
// Example: Add Grade 10 Math
if (lead.grade === 'Grade 10' && lead.subjects && lead.subjects.includes('MATHEMATICS')) {
    videoUrl = 'https://your-cdn.com/grade10-math.m3u8';
    startTime = '2026-02-15T08:00:00+05:30';
}
```

## Files Modified

1. **`/app/live-classroom/page.tsx`**
   - Added HLS video player with hls.js
   - Implemented countdown timer
   - Added time-based access control

2. **`/lib/email.ts`**
   - Updated `sendLiveClassLinkEmail()` to accept `videoUrl` and `startTime`
   - Includes parameters in classroom link

3. **`/app/api/leads/route.ts`**
   - Determines video URL and start time based on grade/subject
   - Passes parameters to email function

4. **`/app/test-video/page.tsx`** (NEW)
   - Standalone test page for HLS video streaming
   - Useful for testing video URLs before deployment

## Testing

### Test the Video Stream
1. Navigate to: `http://localhost:3000/test-video`
2. Check browser console for HLS loading messages
3. Verify video plays correctly

### Test the Full Flow
1. Register for Grade 12 Physics class
2. Check email for classroom link
3. Click link and verify countdown timer
4. Wait for scheduled time (or modify `startTime` for testing)
5. Verify video automatically starts playing

### Test with Public Access (No Registration)
```
http://localhost:3000/live-classroom?
  public=true&
  grade=Grade%2012&
  subject=Physics&
  videoUrl=https://d36f5jgespoy2j.cloudfront.net/12%20phy%20edit_720.m3u8&
  startTime=2026-02-17T13:30:00+05:30
```

## Important Notes

### CORS Configuration
Ensure your CloudFront distribution has proper CORS headers:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, HEAD
```

### Email Configuration
Make sure these environment variables are set:
- `SMTP_USER`: Your Gmail address
- `SMTP_PASS`: App-specific password
- `NEXT_PUBLIC_BASE_URL`: Your production URL

### Video Format
- HLS streams must be in `.m3u8` format
- Recommended: 720p resolution for balance of quality and bandwidth
- Ensure proper encoding with H.264 video and AAC audio

## Troubleshooting

### Video Doesn't Play
1. Check browser console for errors
2. Verify CORS headers on CloudFront
3. Test video URL in VLC player
4. Check network tab for failed requests

### Countdown Not Working
1. Verify `startTime` is in correct ISO format
2. Check timezone (should be +05:30 for IST)
3. Ensure time is in the future

### Email Not Received
1. Check SMTP credentials in `.env.local`
2. Verify email in spam folder
3. Check server logs for email errors

## Future Enhancements

1. **Recording Playback**: Save recordings after class ends
2. **Multiple Video Qualities**: Allow students to choose quality
3. **Live Chat Integration**: Real-time chat during class
4. **Analytics**: Track viewership and engagement
5. **Automated Reminders**: Send email reminders before class starts
