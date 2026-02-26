import os
import re
import yaml

def test_read_config():
    # Write test yaml
    content = """google_assistant:
  project_id: homeassistant-garpinier
  service_account: !include HA_garpinier_SA.json
  report_state: true
  expose_by_default: true
  exposed_domains:
  #   - script
  #   - switch
    - light
  entity_config:
    light.3g_wifi_switch_wifi_ble_backlight:
      expose: false
    switch.test:
      expose: true
"""
    with open('test_ga.yaml', 'w') as f:
        f.write(content)
        
    with open('test_ga.yaml', 'r') as f:
        config = yaml.safe_load(f)
        ga_config = config.get('google_assistant', {})
        
        entity_configs = ga_config.get('entity_config', {})
        expose_by_default = ga_config.get('expose_by_default', False)
        
        has_exposed_domains = 'exposed_domains' in ga_config
        exposed_domains = ga_config.get('exposed_domains') or []
        
        print(f"expose_by_default: {expose_by_default}")
        print(f"has_exposed_domains: {has_exposed_domains}")
        print(f"exposed_domains: {exposed_domains}")
        print(f"entity_config: {entity_configs}")

def update_yaml_domain_exposure(filepath: str, domain: str, should_expose: bool) -> bool:
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            lines = f.readlines()
            
        in_ga = False
        ga_indent = ""
        in_exposed_domains = False
        exposed_domains_idx = -1
        
        domain_idx = -1
        domain_indent = ""
        is_commented = False
        
        for i, line in enumerate(lines):
            stripped = line.strip()
            
            if stripped.startswith('google_assistant:'):
                in_ga = True
                ga_indent = line[:len(line) - len(line.lstrip())]
                continue
                
            if stripped.startswith('exposed_domains:'):
                in_exposed_domains = True
                exposed_domains_idx = i
                continue
                
            if in_exposed_domains:
                # Check if we left the block
                if stripped and not stripped.startswith('-') and not stripped.startswith('#') and not stripped.startswith('exposed_domains:'):
                    if not line.lstrip().startswith('-') and not line.lstrip().startswith('#'):
                         pass
                
                # Match `- light` or `- "light"` capturing leading spaces
                match_active = re.match(r'^(\s*)-\s*(\"?'+ domain + r'\"?)\s*$', line)
                match_commented = re.match(r'^(\s*)#\s*-\s*(\"?'+ domain + r'\"?)\s*$', line)
                
                if match_active:
                    domain_idx = i
                    is_commented = False
                    domain_indent = match_active.group(1)
                    break
                elif match_commented:
                    domain_idx = i
                    is_commented = True
                    domain_indent = match_commented.group(1)
                    break
                    
        # If found
        if domain_idx != -1:
            if should_expose and is_commented:
                # uncomment: replace the first '#' with space or remove it
                lines[domain_idx] = lines[domain_idx].replace('#', ' ', 1)
            elif not should_expose and not is_commented:
                # comment
                lines[domain_idx] = domain_indent + "# " + lines[domain_idx].lstrip()
        else:
            # We need to inject it under exposed_domains
            if exposed_domains_idx != -1:
                # find the indent of exposed_domains
                base_indent_match = re.search(r'^(\s*)', lines[exposed_domains_idx])
                base_indent = base_indent_match.group(1) if base_indent_match else ""
                child_indent = base_indent + "  "
                
                if should_expose:
                    new_line = f"{child_indent}- {domain}\n"
                else:
                    new_line = f"{child_indent}# - {domain}\n"
                    
                lines.insert(exposed_domains_idx + 1, new_line)
            else:
                pass
                
        with open(filepath, 'w', encoding='utf-8') as f:
            f.writelines(lines)
            
        return True
    except Exception as e:
        print(f"Failed to write GAIA domain YAML update: {e}")
        return False

test_read_config()
update_yaml_domain_exposure('test_ga.yaml', 'switch', True)
update_yaml_domain_exposure('test_ga.yaml', 'light', False)
with open('test_ga.yaml', 'r') as f:
    print("\n--- Modified YAML ---")
    print(f.read())
