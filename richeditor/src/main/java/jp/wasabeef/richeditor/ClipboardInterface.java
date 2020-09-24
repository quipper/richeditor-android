package jp.wasabeef.richeditor;

import android.content.ClipData;
import android.content.ClipDescription;
import android.content.ClipboardManager;
import android.content.Context;

public class ClipboardInterface {
    private Context context;

    public ClipboardInterface(Context context) {
        this.context = context;
    }

    @android.webkit.JavascriptInterface
    public String getText() {
        String plainText = "";
        ClipboardManager cm = (ClipboardManager) context
                .getSystemService(Context.CLIPBOARD_SERVICE);
        if (cm != null) {
            ClipData cd = cm.getPrimaryClip();
            if (cd != null && cd.getDescription().hasMimeType(ClipDescription.MIMETYPE_TEXT_PLAIN) && cd.getItemCount() > 0) {
                ClipData.Item item = cd.getItemAt(0);
                plainText = item.getText().toString();
            }
        }
        return plainText;
    }
}
