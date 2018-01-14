import moviepy.editor as mp
import numpy as np

# Get GIF dimensions and length
gif = mp.VideoFileClip("./test_data/yes4.gif")
[gif_width, gif_height] = gif.size
total_gif_length = gif.duration
frames = [frame for frame in gif.iter_frames()]
frame_length = total_gif_length / len(frames)

# Count the number of flashes per second in the image
flash_count = 0
framediff_flash_threshold = 0.5
for i in range(1, len(frames)):
    frame_prev = np.array(frames[i], dtype=int)
    frame_cur = np.array(frames[i - 1], dtype=int)
    print(frames[i][0][0])
    framediff_norm = np.linalg.norm(frame_cur - frame_prev) / (gif_width * gif_height)
    print(framediff_norm)
    if (framediff_norm > framediff_flash_threshold):
        flash_count += 1


normalized_flash_count = flash_count * (1 / total_gif_length)
print(normalized_flash_count)
if normalized_flash_count > 3:
    print("RESULT: DANGER")
else:
    print("RESULT: NO DANGER")
